const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('parqueadero.db');

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Crear tabla si no existe
db.run("CREATE TABLE IF NOT EXISTS parqueos (id INTEGER PRIMARY KEY AUTOINCREMENT, placa TEXT, horaEntrada TEXT, horaSalida TEXT)");

// Ruta para registrar entrada
app.post('/registrar-entrada', (req, res) => {
  const { placa } = req.body;
  const horaEntrada = new Date().toISOString();
  db.run(`INSERT INTO parqueos (placa, horaEntrada) VALUES (?, ?)`, [placa, horaEntrada], function(err) {
    if (err) {
      return res.status(500).send("Error al registrar la entrada.");
    }
    res.send("Entrada registrada correctamente.");
  });
});

// Ruta para listar parqueos
app.get('/parqueos', (req, res) => {
  db.all("SELECT * FROM parqueos", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Error al obtener los parqueos.");
    }
    res.json(rows);
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
