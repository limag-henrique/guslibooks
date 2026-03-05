const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
db.all('SELECT name, long_description FROM Products', [], (err, rows) => {
    rows.forEach(r => {
        const desc = r.long_description || '';
        const match = desc.match(/(\d+)\s*(?:páginas|paginas|Páginas|Paginas|pág\.?|Pág\.?|p\.?|P\.?)/i) || desc.match(/\((\d+)\)/);
        if (!match) {
            console.log("NO MATCH:", r.name, desc.slice(-80));
        } else {
            console.log("MATCH:", r.name, "=>", match[0]);
        }
    });
});
