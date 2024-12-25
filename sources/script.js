// Générer les tableaux des lignes attendues
const generateTableHTML = (tableData) => {
    let html = '<table>';
    tableData.forEach((row, index) => {
        const tag = index === 0 ? 'th' : 'td';
        html += '<tr>' + row.map(cell => `<${tag}>${cell}</${tag}>`).join('') + '</tr>';
    });
    html += '</table>';
    return html;
};

// Générer la page
const generatePage = (data) => {
    const contentDiv = document.getElementById('content');

    data.forEach((item, index) => {
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('toggle-button');
        toggleButton.textContent = "Solution";

        const questionText = document.createElement('div');
        questionText.classList.add('question');
        questionText.textContent = `Q${index + 1}: ${item.question}`;

        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');
        questionContainer.appendChild(questionText);
        if (item.sql) {
            questionContainer.appendChild(toggleButton);
        }

        const solutionDiv = document.createElement('div');
        solutionDiv.classList.add('solution');
        solutionDiv.innerHTML = `
            <pre><code>${item.sql}</code></pre>
        `;

        const table = document.createElement('div');
        table.innerHTML = generateTableHTML(item.table);

        contentDiv.appendChild(questionContainer);
        contentDiv.appendChild(solutionDiv);
        contentDiv.appendChild(table);

        toggleButton.addEventListener('click', () => {
            const isHidden = solutionDiv.style.display === "none" || solutionDiv.style.display === "";
            solutionDiv.style.display = isHidden ? "block" : "none";
            toggleButton.textContent = isHidden ? "Masquer" : "Solution";
        });
    });
};

// Liste des mots-clés SQL à mettre en évidence
const sqlKeywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "INNER", "LEFT", "RIGHT", "JOIN", "ON", "GROUP BY", "ORDER BY",
    "HAVING", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE TABLE", "DROP TABLE",
    "ALTER TABLE", "DISTINCT", "AS", "IN", "NOT", "NULL", "IS", "LIKE", "BETWEEN", "EXISTS", "COUNT",
    "SUM", "AVG", "MIN", "MAX", "LIMIT", "OFFSET", 'WITH'
];

// mots-clés SQL
const highlightSQLKeywords = (codeElement) => {
    let codeText = codeElement.innerText;
    sqlKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        codeText = codeText.replace(regex, `<span class="sql-keyword">${keyword}</span>`);
    });
    codeElement.innerHTML = codeText;
};

// Après le chargement de la page pour éviter la desync
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