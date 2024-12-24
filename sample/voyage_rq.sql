-- Listez les clients dont l'adresse contient le mot "Lake".
SELECT nom, adresse
  FROM Client
WHERE adresse LIKE '%Lake%';

-- Affichez les bonus dont le prix dépasse 300.
SELECT nom, prix FROM Bonus WHERE prix > 300;

-- Listez les voyages réservés par le client nommé "Chris Montgomery".
SELECT v.idVoyage, v.depart, v.arrivee
FROM Voyage v
JOIN Reservation r ON v.idVoyage = r.idVoyage
JOIN Client c ON r.idClient = c.idClient
WHERE c.nom = 'Chris Montgomery';

-- Affichez les voyages ayant une étape à Martinezmouth et les clients associés.
SELECT v.idVoyage, v.depart, v.arrivee, c.nom AS client_nom
FROM Etape e
JOIN Voyage v ON e.idVoyage = v.idVoyage
JOIN Reservation r ON v.idVoyage = r.idVoyage
JOIN Client c ON r.idClient = c.idClient
WHERE e.localisation = 'Martinezmouth'
ORDER BY 1;

-- Trouvez les clients ayant réservé un voyage avec le bonus "Accès salon VIP".
SELECT c.nom
FROM Client c
JOIN Reservation r ON c.idClient = r.idClient
JOIN Amelioration a ON r.idClient = a.idClient AND r.idVoyage = a.idVoyage
JOIN Bonus b ON a.idBonus = b.idBonus
WHERE b.nom = 'Accès salon VIP';

-- Listez les clients ayant dépensé plus de 1950 pour un voyage.
SELECT c.nom, v.depart, v.arrivee, r.prixTot
FROM Client c
JOIN Reservation r ON c.idClient = r.idClient
JOIN Voyage v ON r.idVoyage = v.idVoyage
WHERE r.prixTot > 1950
ORDER BY 4 DESC;

-- Lister les options prises pour le voyage d'id 42 et les clients associés
SELECT b.nom AS bonus, b.description AS description, c.nom AS client
FROM Amelioration a
JOIN Bonus b ON a.idBonus = b.idBonus
JOIN Client c ON a.idClient = c.idClient
WHERE a.idVoyage = 42
ORDER BY b.nom ASC;

-- Listez les clients n'ayant jamais réservé de voyage.
SELECT c.nom
FROM Client c
LEFT JOIN Reservation r ON c.idClient = r.idClient
WHERE r.idClient IS NULL;

-- Affichez les voyages qui n'ont pas encore été réservés.
SELECT v.depart, v.arrivee
FROM Voyage v
LEFT JOIN Reservation r ON v.idVoyage = r.idVoyage
WHERE r.idVoyage IS NULL;

-- Combien de clients sont enregistrés dans la table Client ?
SELECT COUNT(*) FROM Client as 'Clients count';

-- Calculez la somme totale des prix de toutes les réservations.
SELECT SUM(prixTot) AS total_revenu
FROM Reservation;

-- Comptez les réservations dont le prix total est supérieur à 1500.
SELECT COUNT(*) AS reservations_sup_1500
FROM Reservation
WHERE prixTot > 1500;

-- Calculez la somme totale des prix des réservations effectuées au cours des 6 derniers mois.
SELECT SUM(prixTot) AS somme_prix_recentes
FROM Reservation
WHERE date >= DATE('now', '-6 months');

-- Affichez les trois clients ayant effectué le plus grand nombre de réservations.
SELECT c.nom, COUNT(r.idVoyage) AS total_voyages
FROM Client c
JOIN Reservation r ON c.idClient = r.idClient
GROUP BY c.idClient, c.nom
ORDER BY total_voyages DESC
LIMIT 3;

-- Affichez les itinéraires de transport les plus fréquents dans les étapes.
SELECT t.type, COUNT(e.idTransport) AS nb_etapes
FROM Transport t
JOIN Etape e ON t.idTransport = e.idTransport
GROUP BY t.type
ORDER BY nb_etapes DESC;

-- Listez les guides parlant plus de deux langues.
SELECT g.nom, COUNT(lp.idLangue) AS nb_langues
FROM Guides g
JOIN LangueParlee lp ON g.idGuide = lp.idGuide
GROUP BY g.nom
HAVING COUNT(lp.idLangue) > 2;

-- Affichez les étapes présentes dans au moins deux voyages différents.
SELECT e.localisation, COUNT(DISTINCT e.idVoyage) AS nb_voyages
FROM Etape e
GROUP BY e.localisation
HAVING COUNT(DISTINCT e.idVoyage) >= 2;

-- Listez les clients ayant effectué au moins cinq réservations.
SELECT c.nom, COUNT(r.idVoyage) AS nb_reservations
FROM Client c
JOIN Reservation r ON c.idClient = r.idClient
GROUP BY c.nom
HAVING COUNT(r.idVoyage) > 4;

-- Trouvez les bonus les plus populaires (le plus souvent associés à des réservations).
SELECT b.nom, COUNT(a.idBonus) AS nb_utilisations
FROM Bonus b
JOIN Amelioration a ON b.idBonus = a.idBonus
GROUP BY b.nom
ORDER BY nb_utilisations DESC;

-- Affichez le voyage ayant le plus d'étapes et la liste de ces étapes, dans l'ordre chronologique.
WITH VoyageEtapeCount AS (
    SELECT idVoyage, COUNT(*) AS nb_etapes
    FROM Etape
    GROUP BY idVoyage
),
MaxVoyage AS (
    SELECT idVoyage
    FROM VoyageEtapeCount
    ORDER BY nb_etapes DESC
    LIMIT 1
)
SELECT e.localisation, e.date, t.type AS transport, g.nom AS guide
FROM Etape e
JOIN Transport t ON e.idTransport = t.idTransport
JOIN Guides g ON e.idGuide = g.idGuide
WHERE e.idVoyage = (SELECT idVoyage FROM MaxVoyage)
ORDER BY e.date ASC;


