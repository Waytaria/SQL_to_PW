import sqlite3
import json
import os
import argparse
import shutil

# Configuration des arguments
parser = argparse.ArgumentParser(description="Générer un TP SQL.")
parser.add_argument("--db_path", required=True, help="Chemin vers la base de données SQLite.")
parser.add_argument("--sql_file", required=True, help="Chemin vers le fichier SQL.")
parser.add_argument("--output_dir", required=True, help="Dossier de sortie.")
parser.add_argument("--mpd_file_path", required=True, help="Chemin vers le fichier MPD.")
parser.add_argument("--include_solutions", required=True, help="Inclure les solutions dans le TP.")
args = parser.parse_args()

# Début du code
db_path = args.db_path
sql_file = args.sql_file
output_dir = args.output_dir
mpd_file_path = args.mpd_file_path
include_solutions = args.include_solutions == 'true'


# Fonction pour copier un fichier depuis le dossier de l'extension vers un autre emplacement
def copy_file(source_relative_path, destination_dir):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    source_path = os.path.join(base_dir, source_relative_path)
    if not os.path.exists(source_path):
        raise FileNotFoundError(f"Le fichier source '{source_path}' est introuvable.")
    destination_path = os.path.join(destination_dir, os.path.basename(source_path))
    os.makedirs(destination_dir, exist_ok=True)
    shutil.copyfile(source_path, destination_path)
    print(f"Fichier copié : {destination_path}")

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

mpd_output_path = os.path.join(output_dir, os.path.basename(mpd_file_path))

# Éxécuter les requêtes et générer les fichiers
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
questions = parse_sql_file(sql_file)
results = []

# Execute les requêtes
for entry in questions:
    question = entry["question"]
    query = entry["sql"]
    table = []
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        table = [columns] + rows
    except sqlite3.Error as e:
        print(f"Erreur lors de l'exécution de la requête SQL pour '{question}': {e}")
    results.append({
        "question": question,
        "sql": query if include_solutions else "",
        "table": table
    })

# Créer les fichiers
os.makedirs(output_dir, exist_ok=True)
with open(os.path.join(output_dir, 'data.js'), 'w') as json_file :
    json_file.write(f"jsonData = {json.dumps(results, indent=4, ensure_ascii=True)}")
copy_file("../sources/script.js", output_dir)
copy_file("../sources/index.html", output_dir)
copy_file("../sources/style.css", output_dir)
# Copie de l'image
with open(mpd_file_path, 'rb') as source_file:
    with open(mpd_output_path, 'wb') as dest_file:
        dest_file.write(source_file.read())