import express from "express";
import sqlite3 from 'sqlite3';
import cors from 'cors';

const db = new sqlite3.Database('./users.db');

const app = express()
app.use(express.json())
app.use(cors()); // Permite requisições de qualquer origem

// CONECTA DATABASE
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT,
  idade INTEGER
)`);

// POST
app.post('/usuarios/adicionar', (req, res) => {

    const { nome, idade, email } = req.body

    db.run("INSERT INTO users (nome, idade, email) VALUES (?, ?, ?)", [nome, idade, email]);

    res.status(201).json({ nome, idade, email })
})

// GET GERAL
app.get('/usuarios/consulta', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        res.json(rows);
    });
});

// GET POR NOME
app.get('/usuarios/consulta/:nome', (req, res) => {
    const nome = req.params.nome;
    db.get("SELECT * FROM users WHERE nome = ?", [nome], (err, rows) => {
        res.status(200).json(rows);
    });
})

// PATCH
app.patch("/usuarios/editar/:nome", (req, res) => {
  const nome = req.params.nome;
  const updates = req.body;

  const fields = Object.keys(updates)
    .map(campo => `${campo} = ?`)
    .join(", ");

  const values = Object.values(updates);

  const sql = `UPDATE users SET ${fields} WHERE nome = ?`;

  db.run(sql, [...values, nome], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json({ sucesso: this.changes > 0 });
  });
});

// DELETE
app.delete('/usuarios/apagar/:nome', (req, res) => {
    const nome = req.params.nome;
    db.run("DELETE FROM users WHERE nome = ?", [nome]);
    res.status(200).send().json({mensagem:"usuário deletado!"});
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})