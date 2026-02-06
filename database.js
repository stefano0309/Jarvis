const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path'); // Gestione percorsi

const app = express();
const db = new Database('dati.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    dateTime DATETIME DEFAULT CURRENT_TIMESTAMP, 
    domanda TEXT, 
    risposta TEXT
  )
`).run();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/load-chat', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM chats ORDER BY dateTime DESC').all();
        res.json({ chats: rows });
    } catch (err) {
        res.status(500).json({ error: "Errore DB" });
    }
});

app.post('/save-chat', (req, res) => {
    const { domanda, risposta } = req.body;
    const insert = db.prepare('INSERT INTO chats (domanda, risposta) VALUES (?, ?)');
    insert.run(domanda, risposta);
    res.json({ status: "success" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Jarvis pronto su http://localhost:${PORT}`));