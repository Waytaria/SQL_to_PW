# TP SQL Automatique

Ce projet génère automatiquement un TP SQL complet sous forme de page HTML interactive à partir d'un fichier SQL structuré. Les questions, requêtes SQL, solutions et résultats des requêtes sont extraits et mis en forme.

## Fonctionnalités

1. **Extraction des Questions et Requêtes** :
   - Les questions doivent être placées dans le fichier SQL comme commentaires (`-- Question`).
   - Les requêtes associées sont situées immédiatement après les commentaires.

2. **Exécution Automatique des Requêtes** :
   - Les requêtes SQL sont exécutées sur une base de données SQLite.
   - Les résultats sont récupérés et formatés en tableau.

3. **Génération de Fichiers Automatique** :
   - `index.html` : Une page HTML avec les questions, solutions, et tableaux des résultats.
   - `script.js` : Le script JavaScript pour gérer l'interactivité (afficher/masquer les solutions, mise en évidence des mots-clés SQL, etc.).
   - `style.css` : Les styles pour une présentation propre et moderne.
   - Un fichier image MCD est inclus si spécifié.

4. **Visualisation du MCD (Modèle Conceptuel de Données)** :
   - Un bouton permet d'afficher ou de masquer une image du MCD (par exemple, un fichier SVG ou PNG).

## Fichiers Nécessaires

1. **Base de Données SQLite** :
   - Par défaut : `sample/Voyage.db`
   - À remplacer par votre base.

2. **Fichier SQL** :
   - Par défaut : `sample/voyage_rq.sql`
   - À remplacer par votre fichier de requêtes
   - Format attendu :

```sql
-- Question 1 : Listez les clients dont l'adresse contient le mot "Lake".
SELECT nom, adresse FROM Client WHERE adresse LIKE '%Lake%';

-- Question 2 : Affichez les bonus dont le prix dépasse 300.
SELECT nom, prix FROM Bonus WHERE prix > 300;
```

3. **Image du MPD** :
   - Par défaut : `sample/mpd.png`
   - À remplacer par votre fichier MPD
   - Ce fichier est copié dans le dossier de sortie pour être intégré à la page HTML.

## Structure Générée

Le script génère un dossier `output` contenant :

```
output/
├── index.html      # Page HTML générée
├── script.js       # Script JavaScript pour l'interactivité
├── style.css       # Fichier CSS pour le style
└── mpd.png         # Copie de l'image MCD (si fournie)
```

## Utilisation

### Prérequis
- Python 3.7+
- SQLite3 installé

### Étapes

1. **Préparez vos fichiers** :
   - Assurez-vous d'avoir une base de données SQLite prête.
   - Créez un fichier SQL contenant vos questions et requêtes selon le format spécifié.
   - Placez une image MPD dans le dossier spécifié.

2. **Exécutez le script** :

```bash
python script.py
```

3. **Consultez le résultat** :
   - Accédez au fichier `output/index.html` dans un navigateur pour voir le TP généré.

## Contributions

Les contributions sont les bienvenues ! Si vous trouvez des bugs ou avez des suggestions d'amélioration, ouvrez une issue ou une pull request.

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, de le modifier et de le partager. Merci de simplement me créditer si vous réutiliser le projet :)