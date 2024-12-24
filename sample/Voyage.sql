DROP TABLE IF EXISTS LangueParlee;
DROP TABLE IF EXISTS Langues;
DROP TABLE IF EXISTS Etape;
DROP TABLE IF EXISTS Guides;
DROP TABLE IF EXISTS Transport;
DROP TABLE IF EXISTS Reservation;
DROP TABLE IF EXISTS Amelioration;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Bonus;
DROP TABLE IF EXISTS Voyage;

-- Table Client
CREATE TABLE Client (
    idClient INTEGER PRIMARY KEY,
    nom TEXT,
    adresse TEXT,
    tel TEXT,
    mail TEXT
);

-- Table Bonus
CREATE TABLE Bonus (
    idBonus INTEGER PRIMARY KEY,
    nom TEXT,
    description TEXT,
    prix INT
);

-- Table Voyage
CREATE TABLE Voyage (
    idVoyage INTEGER PRIMARY KEY,
    depart TEXT,
    arrivee TEXT
);

-- Table Reservation
CREATE TABLE Reservation (
    idClient INTEGER,
    idVoyage INTEGER,
    date TEXT,
    prixTot REAL,
    PRIMARY KEY (idClient, idVoyage),
    FOREIGN KEY (idClient) REFERENCES Client(idClient),
    FOREIGN KEY (idVoyage) REFERENCES Voyage(idVoyage)
);

-- Table Amelioration (relation entre Client et Bonus)
CREATE TABLE Amelioration (
    idClient INTEGER,
    idVoyage INTEGER,
    idBonus INTEGER,
    PRIMARY KEY (idClient, idVoyage, idBonus),
    FOREIGN KEY (idClient, idVoyage) REFERENCES Reservation(idClient, idVoyage),
    FOREIGN KEY (idBonus) REFERENCES Bonus(idBonus)
);

-- Table Transport
CREATE TABLE Transport (
    idTransport INTEGER PRIMARY KEY,
    type TEXT,
    compagnie TEXT
);

-- Table Etape
CREATE TABLE Etape (
    localisation TEXT,
    idTransport INTEGER,
    idVoyage INTEGER,
    idGuide INTEGER,
    date TEXT,
    PRIMARY KEY (localisation, idTransport, idVoyage, idGuide),
    FOREIGN KEY (idTransport) REFERENCES Transport(idTransport),
    FOREIGN KEY (idVoyage) REFERENCES Voyage(idVoyage),
    FOREIGN KEY (idGuide) REFERENCES Guides(idGuide)
);

-- Table Guides
CREATE TABLE Guides (
    idGuide INTEGER PRIMARY KEY,
    numeroTel TEXT,
    nom TEXT
);

-- Table Langues
CREATE TABLE Langues (
    idLangue INTEGER PRIMARY KEY,
    nom TEXT
);

-- Table LangueParlee (relation entre Guides et Langues)
CREATE TABLE LangueParlee (
    idGuide INTEGER,
    idLangue INTEGER,
    PRIMARY KEY (idGuide, idLangue),
    FOREIGN KEY (idGuide) REFERENCES Guides(idGuide),
    FOREIGN KEY (idLangue) REFERENCES Langues(idLangue)
);