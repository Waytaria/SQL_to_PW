const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.generateTP', async function () {
        const editor = vscode.window.activeTextEditor;

        // Vérifier qu'un workspace est ouvert
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage("Aucun dossier n'est ouvert. Veuillez ouvrir un dossier dans VSCode.");
            return;
        }

        // Récupérer le chemin du workspace
        const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;

        // Demander les chemins des fichiers nécessaires
        const dbPath = await vscode.window.showInputBox({
            prompt: "Chemin relatif au fichier de base de données SQLite",
            value: "yourDatabase.db"
        });

        const sqlFile = await vscode.window.showInputBox({
            prompt: "Chemin relatif au fichier SQL",
            value: "SQL_rq_file.sql"
        });

        const outputDir = await vscode.window.showInputBox({
            prompt: "Nom du dossier de sortie (sera créé s'il n'existe pas)",
            value: "output"
        });

        const mpdFilePath = await vscode.window.showInputBox({
            prompt: "Chemin relatif au fichier MPD (exemple : mpd.png)",
            value: "mpd.png"
        });

        const includeSolutionsSelection = await vscode.window.showQuickPick(["Oui", "Non"], {
            placeHolder: "Inclure les solutions dans le TP ?",
        });
        
        // Vérifier si l'utilisateur a sélectionné "Oui"
        const includeSolutions = includeSolutionsSelection === "Oui";
        if (includeSolutionsSelection === undefined) {
            vscode.window.showErrorMessage("Vous devez choisir une option pour inclure ou non les solutions !");
            return;
        }        

        if (!dbPath || !sqlFile || !outputDir || !mpdFilePath) {
            vscode.window.showErrorMessage("Tous les champs doivent être remplis !");
            return;
        }

        // Construire les chemins absolus
        const absoluteDbPath = path.join(workspaceFolder, dbPath);
        const absoluteSqlFile = path.join(workspaceFolder, sqlFile);
        const absoluteOutputDir = path.join(workspaceFolder, outputDir);
        const absoluteMpdFilePath = path.join(workspaceFolder, mpdFilePath);

        // Vérifier l'existence des fichiers
        if (!fs.existsSync(absoluteDbPath)) {
            vscode.window.showErrorMessage(`Fichier de base de données introuvable : ${absoluteDbPath}`);
            return;
        }
        if (!fs.existsSync(absoluteSqlFile)) {
            vscode.window.showErrorMessage(`Fichier SQL introuvable : ${absoluteSqlFile}`);
            return;
        }
        if (!fs.existsSync(absoluteMpdFilePath)) {
            vscode.window.showErrorMessage(`Fichier MPD introuvable : ${absoluteMpdFilePath}`);
            return;
        }

        // Exécuter le script Python
        const pythonScript = path.join(__dirname, 'python', 'SQL_to_PW.py');
        const command = `python "${pythonScript}" --db_path "${absoluteDbPath}" --sql_file "${absoluteSqlFile}" --output_dir "${absoluteOutputDir}" --mpd_file_path "${absoluteMpdFilePath}" --include_solutions ${includeSolutions}`;
        vscode.window.showInformationMessage("Génération en cours...");
        exec(command, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Erreur lors de l'exécution : ${stderr}`);
                return;
            }
            vscode.window.showInformationMessage(includeSolutions);
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
