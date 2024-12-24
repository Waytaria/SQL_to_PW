import sqlite3
import json
import os

db_path = "sample/Voyage.db"
sql_file = "sample/voyage_rq.sql"
output_dir = "output"
mpd_file_path = "sample/mpd.png"

# Fonction pour parser le fichier SQL
def parse_sql_file(sql_file):
    with open(sql_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    questions = []
    current_question = None
    current_query = []

    for line in lines:
        line = line.strip()
        if line.startswith("--"):  # Ligne de commentaire / question
            if current_question:
                questions.append({"question": current_question, "sql": "\n".join(current_query)})
                current_query = []
            current_question = line[2:].strip()
        elif line:
            current_query.append(line)

    if current_question and current_query:
        questions.append({"question": current_question, "sql": "\n".join(current_query)})

    return questions

# Fonction principale pour exécuter les requêtes et générer les fichiers
def execute_queries_and_generate_files(db_path, sql_file, output_dir):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    questions = parse_sql_file(sql_file)
    results = []

    # Créer le dossier de sortie s'il n'existe pas
    os.makedirs(output_dir, exist_ok=True)

    for entry in questions:
        question = entry["question"]
        query = entry["sql"]
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            table = [columns] + rows
        except sqlite3.Error as e:
            print(f"Erreur lors de l'exécution de la requête SQL pour '{question}': {e}")
            table = []

        results.append({
            "question": question,
            "sql": query,
            "table": table
        })

    # Générer le fichier script.js
    script_js_content = f"""
// Générer les tableaux des lignes attendues
const generateTableHTML = (tableData) => {{
    let html = '<table>';
    tableData.forEach((row, index) => {{
        const tag = index === 0 ? 'th' : 'td';
        html += '<tr>' + row.map(cell => `<${{tag}}>${{cell}}</${{tag}}>`).join('') + '</tr>';
    }});
    html += '</table>';
    return html;
}};

// Générer la page
const generatePage = (data) => {{
    const contentDiv = document.getElementById('content');

    data.forEach((item, index) => {{
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('toggle-button');
        toggleButton.textContent = "Solution";

        const questionText = document.createElement('div');
        questionText.classList.add('question');
        questionText.textContent = `Q${{index + 1}}: ${{item.question}}`;

        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');
        questionContainer.appendChild(questionText);
        questionContainer.appendChild(toggleButton);

        const solutionDiv = document.createElement('div');
        solutionDiv.classList.add('solution');
        solutionDiv.innerHTML = `
            <pre><code>${{item.sql}}</code></pre>
        `;

        const table = document.createElement('div');
        table.innerHTML = generateTableHTML(item.table);

        contentDiv.appendChild(questionContainer);
        contentDiv.appendChild(solutionDiv);
        contentDiv.appendChild(table);

        toggleButton.addEventListener('click', () => {{
            const isHidden = solutionDiv.style.display === "none" || solutionDiv.style.display === "";
            solutionDiv.style.display = isHidden ? "block" : "none";
            toggleButton.textContent = isHidden ? "Masquer" : "Solution";
        }});
    }});
}};

// Liste des mots-clés SQL à mettre en évidence
const sqlKeywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "INNER", "LEFT", "RIGHT", "JOIN", "ON", "GROUP BY", "ORDER BY",
    "HAVING", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE TABLE", "DROP TABLE",
    "ALTER TABLE", "DISTINCT", "AS", "IN", "NOT", "NULL", "IS", "LIKE", "BETWEEN", "EXISTS", "COUNT",
    "SUM", "AVG", "MIN", "MAX", "LIMIT", "OFFSET", 'WITH'
];

// mots-clés SQL
const highlightSQLKeywords = (codeElement) => {{
    let codeText = codeElement.innerText;
    sqlKeywords.forEach(keyword => {{
        const regex = new RegExp(`\\\\b${{keyword}}\\\\b`, "gi");
        codeText = codeText.replace(regex, `<span class="sql-keyword">${{keyword}}</span>`);
    }});
    codeElement.innerHTML = codeText;
}};

// Données JSON
const jsonData = {json.dumps(results, indent=4, ensure_ascii=False)};

window.onload = () => {{
    generatePage(jsonData);
    const codeBlocks = document.querySelectorAll("pre code");
    codeBlocks.forEach(highlightSQLKeywords);

    const mcdToggle = document.querySelector(".mcd-toggle");
    const mcdContainer = document.getElementById("mcdContainer");
    const closeMCD = document.getElementById("closeMCD");

    mcdToggle.addEventListener("click", () => {{
        mcdContainer.style.display = mcdContainer.style.display === "flex" ? "none" : "flex";
    }});

    closeMCD.addEventListener("click", () => {{
        mcdContainer.style.display = "none";
    }});
}};
"""
    with open(os.path.join(output_dir, "script.js"), "w", encoding="utf-8") as js_file:
        js_file.write(script_js_content)

    # Générer le fichier HTML
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TP SQL</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>TP SQL</h1>
    <div id="content">
        <button class="mcd-toggle">Afficher le MPD</button>

        <div class="mcd-container" id="mcdContainer">
            <div class="close-mcd" id="closeMCD">&times;</div>
            <img src="{}">
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
""".format(os.path.basename(mpd_file_path))
    with open(os.path.join(output_dir, "index.html"), "w", encoding="utf-8") as html_file:
        html_file.write(html_content)

    # Générer le fichier CSS
    css_content = """
:root {
    /* Couleurs principales */
    --primary-color: #e74c3c;
    --secondary-color: #e74c3c;
    --background-color: #f4f4f4;
    --table-header-color: #dd3422;
    --table-header-text-color: #ffffff;
    --highlight-color: #dc7266;
    --button-hover-color: #e02510;

    /* Polices */
    --font-family: Candara, sans-serif;
    --font-monospace: monospace;

    /* Dimensions */
    --max-width: 60%;
    --table-width: 80%;
}

body {
    font-family: var(--font-family);
    line-height: 1.6;
    margin: 0 auto;
    max-width: var(--max-width);
}
h1 {
    color: var(--secondary-color);
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    padding: 10px;
    border-bottom: 4px solid var(--primary-color);
    margin-bottom: 20px;
}
h2 {
    color: var(--secondary-color);
    font-size: 1.8rem;
    margin-top: 30px;
}
pre {
    background-color: var(--background-color);
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    overflow-x: auto;
}
code {
    color: var(--highlight-color);
    font-family: var(--font-monospace);
}
ul {
    margin-top: 0;
}
.solution {
    display: none;
    margin-top: 10px;
}
h3 {
    cursor: pointer;
    font-weight: bold;
    color: var(--secondary-color);
}

table {
    width: var(--table-width);
    margin: 0 auto;
    border-collapse: collapse;
    margin-bottom: 20px;
}
th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
th {
    background-color: var(--table-header-color);
    color: var(--table-header-text-color);
}
tr:nth-child(even) {
    background-color: #f2f2f2;
}

.mcd-container {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}
.mcd-container object {
    width: 90%;
    height: 120%;
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.mcd-toggle {
    position: fixed;
    bottom: 20px;
    left: 20px;
    padding: 10px 20px;
    background-color: var(--primary-color);
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1100;
}
.mcd-toggle:hover {
    background-color: var(--button-hover-color);
}
.close-mcd {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 1.5rem;
    color: white;
    cursor: pointer;
    z-index: 1200;
}

.sql-keyword {
    color: var(--primary-color);
    font-weight: bolder;
}

button.toggle-button {
    padding: 5px 10px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
button.toggle-button:hover {
    background-color: var(--button-hover-color);
}

.question-container {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
}
"""
    with open(os.path.join(output_dir, "style.css"), "w", encoding="utf-8") as css_file:
        css_file.write(css_content)

    print(f"Fichiers générés dans le dossier : {output_dir}")
    conn.close()

mpd_output_path = os.path.join(output_dir, os.path.basename(mpd_file_path))
execute_queries_and_generate_files(db_path, sql_file, output_dir)
with open(mpd_file_path, 'rb') as source_file:
    with open(mpd_output_path, 'wb') as dest_file:
        dest_file.write(source_file.read())