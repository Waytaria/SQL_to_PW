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
        questionContainer.appendChild(toggleButton);

        const solutionDiv = document.createElement('div');
        solutionDiv.classList.add('solution');
        solutionDiv.innerHTML = `
            <pre><code>${item.sql}</code></pre>
        `;

        const table = document.createElement('div');
        table.innerHTML = generateTableHTML(item.table)
        
        contentDiv.appendChild(questionContainer);
        contentDiv.appendChild(solutionDiv);
        contentDiv.appendChild(table);
        

        // Ajouter l'événement toggle
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

window.onload = () => {
    generatePage(jsonData);
    const codeBlocks = document.querySelectorAll("pre code");
    codeBlocks.forEach(highlightSQLKeywords);

    const mcdToggle = document.querySelector(".mcd-toggle");
    const mcdContainer = document.getElementById("mcdContainer");
    const closeMCD = document.getElementById("closeMCD");

    mcdToggle.addEventListener("click", () => {
        mcdContainer.style.display = mcdContainer.style.display === "flex" ? "none" : "flex";
    });

    closeMCD.addEventListener("click", () => {
        mcdContainer.style.display = "none";
    });
}

const jsonData = [
    {
        "question": "Listez les clients dont l'adresse contient le mot \"Lake\".",
        "sql": "SELECT nom, adresse\nFROM Client\nWHERE adresse LIKE '%Lake%';",
        "table": [
            [
                "nom",
                "adresse"
            ],
            [
                "Charles Swanson",
                "27608 Casey Lock\nLake Michael, WY 71453"
            ],
            [
                "Jamie Richards",
                "4026 Andrew Courts\nLake Cole, DC 46368"
            ],
            [
                "Amber Webb",
                "8713 Lauren Knolls Apt. 010\nLake Ryantown, TX 97143"
            ],
            [
                "Traci Martin",
                "28725 Gonzalez Streets Apt. 413\nLake Elizabeth, UT 98487"
            ],
            [
                "Dylan Roberson",
                "12435 Eric Way Suite 141\nLake Kelseyland, AL 07467"
            ],
            [
                "Nathan Hart",
                "9465 Robert Plaza Suite 469\nLake Samantha, PW 56184"
            ],
            [
                "Ashley Nelson",
                "1843 Lori Street\nLake Shannonville, NM 17812"
            ],
            [
                "Michelle Howell",
                "6378 Khan Lake Apt. 593\nSouth Hannahfort, HI 97293"
            ],
            [
                "Ryan Cervantes",
                "794 Mary Mews Apt. 660\nLake David, NH 30992"
            ],
            [
                "Julie Miller",
                "4116 Gardner Passage Apt. 740\nLake Anneville, AZ 30770"
            ],
            [
                "Brandon Walker",
                "001 Velez Ville Suite 399\nLake Kellyborough, MA 36277"
            ]
        ]
    },
    {
        "question": "Affichez les bonus dont le prix dépasse 300.",
        "sql": "SELECT nom, prix FROM Bonus WHERE prix > 300;",
        "table": [
            [
                "nom",
                "prix"
            ],
            [
                "Accès salon VIP",
                447
            ],
            [
                "Restauration premium",
                431
            ],
            [
                "Soirée culturelle",
                404
            ]
        ]
    },
    {
        "question": "Listez les voyages réservés par le client nommé \"Chris Montgomery\".",
        "sql": "SELECT v.idVoyage, v.depart, v.arrivee\nFROM Voyage v\nJOIN Reservation r ON v.idVoyage = r.idVoyage\nJOIN Client c ON r.idClient = c.idClient\nWHERE c.nom = 'Chris Montgomery';",
        "table": [
            [
                "idVoyage",
                "depart",
                "arrivee"
            ],
            [
                41,
                "Hoton",
                "New Andreamouth"
            ],
            [
                50,
                "Lisabury",
                "Erikahaven"
            ],
            [
                61,
                "West Melissachester",
                "Houstonview"
            ],
            [
                66,
                "Kelleyberg",
                "Maxwellland"
            ],
            [
                180,
                "Johnsonfort",
                "West Edwardborough"
            ]
        ]
    },
    {
        "question": "Affichez les voyages ayant une étape à Martinezmouth et les clients associés.",
        "sql": "SELECT v.idVoyage, v.depart, v.arrivee, c.nom AS client_nom\nFROM Etape e\nJOIN Voyage v ON e.idVoyage = v.idVoyage\nJOIN Reservation r ON v.idVoyage = r.idVoyage\nJOIN Client c ON r.idClient = c.idClient\nWHERE e.localisation = 'Martinezmouth'\nORDER BY 1;",
        "table": [
            [
                "idVoyage",
                "depart",
                "arrivee",
                "client_nom"
            ],
            [
                4,
                "South Nancyborough",
                "West Elaineton",
                "Reginald Gutierrez"
            ],
            [
                4,
                "South Nancyborough",
                "West Elaineton",
                "Erik Dunn"
            ],
            [
                4,
                "South Nancyborough",
                "West Elaineton",
                "Sherri Brown"
            ],
            [
                42,
                "North Valerieshire",
                "Jamesfurt",
                "Mary Gonzalez"
            ],
            [
                42,
                "North Valerieshire",
                "Jamesfurt",
                "Thomas Mckee"
            ]
        ]
    },
    {
        "question": "Trouvez les clients ayant réservé un voyage avec le bonus \"Accès salon VIP\".",
        "sql": "SELECT c.nom\nFROM Client c\nJOIN Reservation r ON c.idClient = r.idClient\nJOIN Amelioration a ON r.idClient = a.idClient AND r.idVoyage = a.idVoyage\nJOIN Bonus b ON a.idBonus = b.idBonus\nWHERE b.nom = 'Accès salon VIP';",
        "table": [
            [
                "nom"
            ],
            [
                "Jeffery Gross"
            ],
            [
                "Cynthia Cruz"
            ],
            [
                "David Gamble"
            ],
            [
                "Charles Kim"
            ],
            [
                "Dr. Kaylee Tapia"
            ],
            [
                "Reginald Gutierrez"
            ],
            [
                "Andrea Brown"
            ],
            [
                "Thomas Mckee"
            ],
            [
                "Andrea Brown"
            ],
            [
                "Robin Brown"
            ],
            [
                "Carol Munoz"
            ],
            [
                "Jessica Barrett"
            ],
            [
                "Joshua Reyes"
            ],
            [
                "Lisa Caldwell"
            ],
            [
                "Dennis Burns"
            ],
            [
                "Misty Jackson"
            ],
            [
                "Colleen Wagner"
            ],
            [
                "Mitchell Jones"
            ],
            [
                "Ronald Gregory"
            ],
            [
                "Ashley Nelson"
            ],
            [
                "Jeffery Gross"
            ],
            [
                "Morgan Krueger"
            ],
            [
                "Bryan Lee"
            ],
            [
                "Jonathan Taylor"
            ],
            [
                "Carol Munoz"
            ],
            [
                "Michael Murillo MD"
            ],
            [
                "Amanda Fritz MD"
            ],
            [
                "Thomas Mckee"
            ],
            [
                "Kenneth Wolfe"
            ],
            [
                "Randy Cole"
            ],
            [
                "Shawn Pace"
            ],
            [
                "Veronica Owen"
            ],
            [
                "Sandra Hughes"
            ],
            [
                "Anthony Carpenter"
            ],
            [
                "Stacie Adams"
            ],
            [
                "Albert West"
            ],
            [
                "Dennis Lane"
            ],
            [
                "Justin Riley"
            ],
            [
                "John Walker"
            ],
            [
                "Jonathan Taylor"
            ]
        ]
    },
    {
        "question": "Listez les clients ayant dépensé plus de 1950 pour un voyage.",
        "sql": "SELECT c.nom, v.depart, v.arrivee, r.prixTot\nFROM Client c\nJOIN Reservation r ON c.idClient = r.idClient\nJOIN Voyage v ON r.idVoyage = v.idVoyage\nWHERE r.prixTot > 1950\nORDER BY 4 DESC;",
        "table": [
            [
                "nom",
                "depart",
                "arrivee",
                "prixTot"
            ],
            [
                "Paul Stephens",
                "Karenshire",
                "South Wendy",
                1997.02
            ],
            [
                "Jonathan Taylor",
                "Garciahaven",
                "Lake Kimberlyside",
                1995.32
            ],
            [
                "Sean Lee",
                "Danatown",
                "North Jenniferview",
                1991.25
            ],
            [
                "Misty Ellis",
                "Lopezmouth",
                "South Daniel",
                1986.95
            ],
            [
                "Nancy Johnson",
                "Gonzalezfort",
                "New Stevenmouth",
                1985.37
            ],
            [
                "George Payne",
                "West David",
                "East Melissamouth",
                1981.29
            ],
            [
                "Kelly Wilkerson",
                "Gordonville",
                "West Lisa",
                1978.96
            ],
            [
                "Dr. Joshua Fox",
                "Julieborough",
                "South Lisachester",
                1974.15
            ],
            [
                "Cheryl Lamb",
                "New Deanna",
                "Port Jenniferburgh",
                1968.05
            ],
            [
                "Andrew Williams",
                "Bryanchester",
                "Edwardland",
                1965.29
            ],
            [
                "Tina Wright",
                "Port Meganland",
                "South Markhaven",
                1960.84
            ],
            [
                "Dr. Kaylee Tapia",
                "Emilyport",
                "Mezaport",
                1954.86
            ]
        ]
    },
    {
        "question": "Lister les options prises pour le voyage d'id 42 et les clients associés",
        "sql": "SELECT b.nom AS bonus, b.description AS description, c.nom AS client\nFROM Amelioration a\nJOIN Bonus b ON a.idBonus = b.idBonus\nJOIN Client c ON a.idClient = c.idClient\nWHERE a.idVoyage = 42\nORDER BY b.nom ASC;",
        "table": [
            [
                "bonus",
                "description",
                "client"
            ],
            [
                "Accès salon VIP",
                "Description de l option accès salon vip.",
                "Thomas Mckee"
            ],
            [
                "Accès spa et bien-être",
                "Description de l option accès spa et bien-être.",
                "Mary Gonzalez"
            ]
        ]
    },
    {
        "question": "Listez les clients n'ayant jamais réservé de voyage.",
        "sql": "SELECT c.nom\nFROM Client c\nLEFT JOIN Reservation r ON c.idClient = r.idClient\nWHERE r.idClient IS NULL;",
        "table": [
            [
                "nom"
            ],
            [
                "Hannah Burns"
            ],
            [
                "Gerald Booker"
            ],
            [
                "Sheila Gutierrez"
            ],
            [
                "Luis Harvey"
            ],
            [
                "Zoe Taylor"
            ],
            [
                "Michael Price"
            ],
            [
                "Jennifer Lopez"
            ],
            [
                "Vincent Black"
            ],
            [
                "Billy Waters"
            ],
            [
                "Debra Foster"
            ],
            [
                "Nicolas Aguilar"
            ],
            [
                "Ryan Ortega"
            ],
            [
                "Alice Bray"
            ],
            [
                "Elizabeth Black"
            ],
            [
                "Christopher Carter"
            ],
            [
                "Amber Jenkins"
            ],
            [
                "Alexandra Yates"
            ],
            [
                "David Scott"
            ],
            [
                "Timothy Chavez"
            ],
            [
                "Kelly Myers"
            ],
            [
                "Christopher Green"
            ],
            [
                "Roger Fisher"
            ],
            [
                "Robin Matthews"
            ],
            [
                "Shawn Smith"
            ],
            [
                "Andrew Diaz"
            ],
            [
                "Alexis Schneider"
            ],
            [
                "Briana Swanson"
            ],
            [
                "Steven Fritz"
            ],
            [
                "Lisa Johnson"
            ],
            [
                "Timothy Anderson"
            ],
            [
                "Reginald Russell"
            ],
            [
                "Stacey Simon"
            ],
            [
                "Danielle Garcia"
            ],
            [
                "Peter Armstrong"
            ],
            [
                "Lindsey Perry"
            ],
            [
                "Patrick Jones"
            ],
            [
                "Willie Austin"
            ],
            [
                "Alexandra Palmer"
            ],
            [
                "Joseph Small"
            ],
            [
                "David Gilbert"
            ],
            [
                "Kathryn Boyd"
            ],
            [
                "Jeffrey Brooks"
            ],
            [
                "Stacey Hill"
            ]
        ]
    },
    {
        "question": "Affichez les voyages qui n'ont pas encore été réservés.",
        "sql": "SELECT v.depart, v.arrivee\nFROM Voyage v\nLEFT JOIN Reservation r ON v.idVoyage = r.idVoyage\nWHERE r.idVoyage IS NULL;",
        "table": [
            [
                "depart",
                "arrivee"
            ],
            [
                "Webbton",
                "New Mercedes"
            ],
            [
                "Brandonmouth",
                "Port Nancy"
            ],
            [
                "Millerville",
                "South Sarahfurt"
            ],
            [
                "West Bryanbury",
                "Franktown"
            ],
            [
                "New Tanyaberg",
                "Anthonychester"
            ],
            [
                "Port Mary",
                "North Benjamin"
            ],
            [
                "South Patriciashire",
                "Port Kimberly"
            ],
            [
                "Drakechester",
                "Derekchester"
            ],
            [
                "Amandaland",
                "Port Susan"
            ],
            [
                "South Jeremy",
                "Port Janet"
            ],
            [
                "Woodsstad",
                "Lake Brittneyland"
            ],
            [
                "Zimmermanton",
                "East Jennifershire"
            ],
            [
                "Santiagofurt",
                "Brooksfort"
            ],
            [
                "North Calvin",
                "Evansville"
            ],
            [
                "Lake Johnshire",
                "West Rebecca"
            ],
            [
                "Webbview",
                "Thomasburgh"
            ],
            [
                "Lake Michelle",
                "West Lindseyton"
            ],
            [
                "Tammyfort",
                "North Sonya"
            ],
            [
                "Lake Kathy",
                "Vanessaburgh"
            ],
            [
                "Weissmouth",
                "Flemingview"
            ],
            [
                "Lake Shannonview",
                "West Tammy"
            ],
            [
                "North Christopherport",
                "West John"
            ],
            [
                "Padillamouth",
                "West Michellebury"
            ],
            [
                "Lake Troyport",
                "West Jacqueline"
            ],
            [
                "Mcdonaldville",
                "Scottside"
            ],
            [
                "Morganmouth",
                "Paulshire"
            ],
            [
                "North Brenda",
                "Kellymouth"
            ],
            [
                "Shawnhaven",
                "Sharifort"
            ],
            [
                "South Julia",
                "Boothshire"
            ],
            [
                "West Antonio",
                "Frankborough"
            ],
            [
                "New Tiffany",
                "Doughertyland"
            ],
            [
                "Kelseybury",
                "Mooreton"
            ],
            [
                "West Lindsey",
                "Port Susanborough"
            ],
            [
                "West Jason",
                "Cynthiabury"
            ],
            [
                "Rodriguezfort",
                "West Maria"
            ],
            [
                "New Margaretfurt",
                "West Stacey"
            ],
            [
                "Barbarahaven",
                "Thomasbury"
            ],
            [
                "Lake Tina",
                "East Antonio"
            ],
            [
                "Annfort",
                "Rodriguezfort"
            ]
        ]
    },
    {
        "question": "Combien de clients sont enregistrés dans la table Client ?",
        "sql": "SELECT COUNT(*) FROM Client as 'Clients count';",
        "table": [
            [
                "COUNT(*)"
            ],
            [
                200
            ]
        ]
    },
    {
        "question": "Calculez la somme totale des prix de toutes les réservations.",
        "sql": "SELECT SUM(prixTot) AS total_revenu\nFROM Reservation;",
        "table": [
            [
                "total_revenu"
            ],
            [
                338724.43
            ]
        ]
    },
    {
        "question": "Comptez les réservations dont le prix total est supérieur à 1500.",
        "sql": "SELECT COUNT(*) AS reservations_sup_1500\nFROM Reservation\nWHERE prixTot > 1500;",
        "table": [
            [
                "reservations_sup_1500"
            ],
            [
                86
            ]
        ]
    },
    {
        "question": "Calculez la somme totale des prix des réservations effectuées au cours des 6 derniers mois.",
        "sql": "SELECT SUM(prixTot) AS somme_prix_recentes\nFROM Reservation\nWHERE date >= DATE('now', '-6 months');",
        "table": [
            [
                "somme_prix_recentes"
            ],
            [
                173796.48
            ]
        ]
    },
    {
        "question": "Affichez les trois clients ayant effectué le plus grand nombre de réservations.",
        "sql": "SELECT c.nom, COUNT(r.idVoyage) AS total_voyages\nFROM Client c\nJOIN Reservation r ON c.idClient = r.idClient\nGROUP BY c.idClient, c.nom\nORDER BY total_voyages DESC\nLIMIT 3;",
        "table": [
            [
                "nom",
                "total_voyages"
            ],
            [
                "Andrea Brown",
                6
            ],
            [
                "Chris Montgomery",
                5
            ],
            [
                "Misty Jackson",
                5
            ]
        ]
    },
    {
        "question": "Affichez les itinéraires de transport les plus fréquents dans les étapes.",
        "sql": "SELECT t.type, COUNT(e.idTransport) AS nb_etapes\nFROM Transport t\nJOIN Etape e ON t.idTransport = e.idTransport\nGROUP BY t.type\nORDER BY nb_etapes DESC;",
        "table": [
            [
                "type",
                "nb_etapes"
            ],
            [
                "Train",
                199
            ],
            [
                "Avion",
                163
            ],
            [
                "Bus",
                138
            ]
        ]
    },
    {
        "question": "Listez les guides parlant plus de deux langues.",
        "sql": "SELECT g.nom, COUNT(lp.idLangue) AS nb_langues\nFROM Guides g\nJOIN LangueParlee lp ON g.idGuide = lp.idGuide\nGROUP BY g.nom\nHAVING COUNT(lp.idLangue) > 2;",
        "table": [
            [
                "nom",
                "nb_langues"
            ],
            [
                "Brittany Holland",
                3
            ],
            [
                "Bryan Farrell",
                3
            ],
            [
                "Carolyn Miles",
                3
            ],
            [
                "Joseph Bishop",
                3
            ],
            [
                "Michele Wise",
                3
            ],
            [
                "Scott Mckee",
                3
            ],
            [
                "Steven Moore",
                5
            ]
        ]
    },
    {
        "question": "Affichez les étapes présentes dans au moins deux voyages différents.",
        "sql": "SELECT e.localisation, COUNT(DISTINCT e.idVoyage) AS nb_voyages\nFROM Etape e\nGROUP BY e.localisation\nHAVING COUNT(DISTINCT e.idVoyage) >= 2;",
        "table": [
            [
                "localisation",
                "nb_voyages"
            ],
            [
                "Amberport",
                2
            ],
            [
                "East Christopher",
                2
            ],
            [
                "Jonathanfurt",
                2
            ],
            [
                "Lake Daniel",
                2
            ],
            [
                "Martinezmouth",
                2
            ],
            [
                "North Ashley",
                2
            ],
            [
                "North Lisa",
                2
            ],
            [
                "South Joshua",
                2
            ],
            [
                "West Thomas",
                2
            ],
            [
                "Whitemouth",
                2
            ]
        ]
    },
    {
        "question": "Listez les clients ayant effectué au moins cinq réservations.",
        "sql": "SELECT c.nom, COUNT(r.idVoyage) AS nb_reservations\nFROM Client c\nJOIN Reservation r ON c.idClient = r.idClient\nGROUP BY c.nom\nHAVING COUNT(r.idVoyage) > 4;",
        "table": [
            [
                "nom",
                "nb_reservations"
            ],
            [
                "Andrea Brown",
                6
            ],
            [
                "Chris Montgomery",
                5
            ],
            [
                "Misty Jackson",
                5
            ],
            [
                "Sherri Brown",
                5
            ]
        ]
    },
    {
        "question": "Trouvez les bonus les plus populaires (le plus souvent associés à des réservations).",
        "sql": "SELECT b.nom, COUNT(a.idBonus) AS nb_utilisations\nFROM Bonus b\nJOIN Amelioration a ON b.idBonus = a.idBonus\nGROUP BY b.nom\nORDER BY nb_utilisations DESC;",
        "table": [
            [
                "nom",
                "nb_utilisations"
            ],
            [
                "Accès salon VIP",
                40
            ],
            [
                "Petit-déjeuner inclus",
                38
            ],
            [
                "Excursion guidée",
                32
            ],
            [
                "Soirée culturelle",
                30
            ],
            [
                "Surclassement en classe affaires",
                28
            ],
            [
                "Restauration premium",
                28
            ],
            [
                "Assurance annulation",
                28
            ],
            [
                "Transfert privé",
                27
            ],
            [
                "Location de voiture",
                25
            ],
            [
                "Accès spa et bien-être",
                24
            ]
        ]
    },
    {
        "question": "Affichez le voyage ayant le plus d'étapes et la liste de ces étapes, dans l'ordre chronologique.",
        "sql": "WITH VoyageEtapeCount AS (\nSELECT idVoyage, COUNT(*) AS nb_etapes\nFROM Etape\nGROUP BY idVoyage\n),\nMaxVoyage AS (\nSELECT idVoyage\nFROM VoyageEtapeCount\nORDER BY nb_etapes DESC\nLIMIT 1\n)\nSELECT e.localisation, e.date, t.type AS transport, g.nom AS guide\nFROM Etape e\nJOIN Transport t ON e.idTransport = t.idTransport\nJOIN Guides g ON e.idGuide = g.idGuide\nWHERE e.idVoyage = (SELECT idVoyage FROM MaxVoyage)\nORDER BY e.date ASC;",
        "table": [
            [
                "localisation",
                "date",
                "transport",
                "guide"
            ],
            [
                "New Ellen",
                "2024-06-13",
                "Train",
                "Ryan Cochran"
            ],
            [
                "Taylorbury",
                "2024-06-17",
                "Avion",
                "Michele Wise"
            ],
            [
                "New Amyshire",
                "2024-06-22",
                "Train",
                "Bryan Farrell"
            ],
            [
                "Sarahmouth",
                "2024-06-28",
                "Train",
                "Carolyn Miles"
            ],
            [
                "Brooksport",
                "2024-07-05",
                "Train",
                "Sarah Cochran"
            ],
            [
                "Lake Lisa",
                "2024-07-09",
                "Bus",
                "Ryan Cochran"
            ],
            [
                "New Jenniferside",
                "2024-07-11",
                "Avion",
                "Johnny Turner"
            ]
        ]
    }
]