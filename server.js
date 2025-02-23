const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Larissa',  
    password: 'Larissa123!', 
    database: 'fabrica_lean'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('Conectado ao MySQL!');
    }
});

// Rota para inserir dados
app.post('/api/interacao', (req, res) => {
    const { sensor, status_estoque, gramas_utilizadas, gramas_restantes } = req.body;

    console.log('Dados recebidos:', { sensor, status_estoque, gramas_utilizadas, gramas_restantes });

    const sql = 'INSERT INTO interacoes (sensor, status_estoque, gramas_utilizadas, gramas_restantes) VALUES (?, ?, ?, ?)';
    db.query(sql, [sensor, status_estoque, gramas_utilizadas, gramas_restantes], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            res.status(500).send('Erro ao inserir dados');
        } else {
            console.log('Dados inseridos com sucesso:', result);
            res.status(200).send('Dados inseridos com sucesso');
        }
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});