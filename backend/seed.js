const fs = require('fs');
const path = require('path');
const db = require('./database.js');

const livrosPath = path.resolve(__dirname, '../livros.txt');
const visualPath = path.resolve(__dirname, '../visual');

// Helper arrays
const variationsData = {
    "Não Quero Ser Como Você": ["Verde", "Vermelha", "Amarela"],
    "Vermelho, Branco e Sangue Azul": ["Vermelho", "Azul"],
    "Frankenstein": ["Old Forest", "Green Hospital"]
};

// Map each book to its direct continuation list
const continuationsData = {
    "Os Dois Morrem no Final": ["O Primeiro a Morrer no Final"],
    "Simon vs. a Agenda Homo Sapiens": ["Leah Fora de Sintonia"],
    "O Guia do Mochileiro das Galáxias": ["O Restaurante no Fim do Universo", "A Vida, o Universo e Tudo Mais"],
    "1984": ["A Revolução dos Bichos"],
    "Procura-se um Namorado": ["Esse é Para Casar"]
};

const visualFiles = fs.readdirSync(visualPath);

function getImagePath(bookName, author) {
    // Try exact match
    const exactMatch = visualFiles.find(f => f === `${bookName}.jpg`);
    if (exactMatch) return `/visual/${exactMatch}`;

    // Check specific known cases
    if (bookName === "IT A Coisa") {
        const itMatch = visualFiles.find(f => f.includes("IT A Coisa"));
        if (itMatch) return `/visual/${itMatch}`;
    }

    // Fuzzy search
    const fuzzy = visualFiles.find(f => f.toLowerCase().includes(bookName.toLowerCase()));
    if (fuzzy) return `/visual/${fuzzy}`;

    return null;
}

function generatePrice() {
    const base = Math.floor(Math.random() * (60 - 30)) + 30; // Random int between 30 and 59
    return (base + 0.99).toFixed(2);
}

const seedDatabase = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile(livrosPath, 'utf8', (err, data) => {
            if (err) return reject(err);

            db.serialize(() => {
                db.run("DROP TABLE IF EXISTS Cart");
                db.run("DROP TABLE IF EXISTS Products");
                db.run("DROP TABLE IF EXISTS Orders");
                db.run("DROP TABLE IF EXISTS Users");

                db.run(`CREATE TABLE IF NOT EXISTS Products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    author TEXT NOT NULL,
                    genre TEXT,
                    short_description TEXT,
                    long_description TEXT,
                    price REAL NOT NULL,
                    image_path TEXT,
                    variations TEXT,
                    continuations TEXT
                )`);

                db.run(`CREATE TABLE IF NOT EXISTS Cart (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    product_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL,
                    FOREIGN KEY (product_id) REFERENCES Products(id)
                )`);

                db.run(`CREATE TABLE IF NOT EXISTS Users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )`);

                db.run(`CREATE TABLE IF NOT EXISTS Orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    total REAL NOT NULL,
                    status TEXT DEFAULT 'Pending',
                    items TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES Users(id)
                )`);

                const insertStmt = db.prepare(`
                    INSERT INTO Products (name, author, genre, short_description, long_description, price, image_path, variations, continuations)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                const lines = data.split('\n').filter(line => line.trim() !== '');

                lines.forEach((line) => {
                    const parts = line.split(';').map(p => p.trim());
                    if (parts.length < 2) return;

                    const name = parts[0];
                    const author = parts[1];
                    const rawGenre = parts[2] || 'Ficção';
                    const subgenre = parts[3] || 'Geral';

                    let genre = rawGenre;

                    const price = parseFloat(generatePrice());
                    const shortDescription = `Um fascinante livro de ${genre} escrito por ${author}.`;
                    const longDescription = `${name} é uma obra-prima envolvente escrita por ${author}. Transitando magistralmente pelo gênero de ${genre} (${subgenre}), esta história levará o leitor a uma jornada inesquecível, cheia de reviravoltas, emoções e reflexões profundas. Ideal para quem busca uma leitura que não apenas entretém, mas que transforma a maneira de ver o mundo.`;
                    const imagePath = getImagePath(name, author);

                    const variations = variationsData[name] ? JSON.stringify(variationsData[name]) : null;
                    const continuations = continuationsData[name] ? JSON.stringify(continuationsData[name]) : null;

                    insertStmt.run(name, author, genre, shortDescription, longDescription, price, imagePath, variations, continuations);
                });

                insertStmt.finalize(() => {
                    console.log("Database seeded successfully.");
                    resolve();
                });
            });
        });
    });
};

if (require.main === module) {
    seedDatabase().then(() => {
        db.close();
        process.exit(0);
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = seedDatabase;
