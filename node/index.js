const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const connection = mysql.createConnection(config);

// Arrays de nomes aleatórios
const names = [
    "Lucas", "João", "Maria", "Ana", "Carlos", "Felipe", "Gabriel", "Pedro", "Rafael", "Paulo",
    "Ricardo", "Eduardo", "Beatriz", "Juliana", "Luana", "Fernanda", "Carla", "Tatiane", "Claudia", "Roberta"
];

// Arrays de sobrenomes aleatórios
const surnames = [
    "Silva", "Santos", "Oliveira", "Souza", "Pereira", "Lima", "Costa", "Martins", "Rodrigues", "Almeida",
    "Mendes", "Gomes", "Ferreira", "Barbosa", "Araujo", "Nascimento", "Ribeiro", "Dias", "Cavalcante", "Moreira"
];

// Função para gerar um nome completo aleatório
const getRandomFullName = () => {
    const firstName = names[Math.floor(Math.random() * names.length)];
    const lastName = surnames[Math.floor(Math.random() * surnames.length)];
    return `${firstName} ${lastName}`;
};

// Função para verificar se o nome já existe no banco
const checkNameExists = (fullName) => {
    return new Promise((resolve, reject) => {
        const checkSql = `SELECT * FROM people WHERE name = ?`;
        connection.query(checkSql, [fullName], (err, results) => {
            if (err) return reject(err);
            resolve(results.length === 0); // Retorna true se o nome não existir
        });
    });
};

// Função para inserir o nome no banco
const insertName = (fullName) => {
    return new Promise((resolve, reject) => {
        const insertSql = `INSERT INTO people(name) VALUES (?)`;
        connection.query(insertSql, [fullName], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

app.get('/', async (req, res) => {
    let inserted = false;
    let attempts = 0;
    let fullName;

    // Tentar até 20 vezes para evitar loop infinito, tentando nomes diferentes
    while (!inserted && attempts < 20) {
        fullName = getRandomFullName();
        
        try {
            const nameExists = await checkNameExists(fullName);
            if (nameExists) {
                await insertName(fullName);
                inserted = true;
                console.log("Registro inserido com sucesso.");
            }
        } catch (err) {
            console.error("Erro ao verificar ou inserir dados:", err);
            return res.status(500).send("Erro ao processar os dados.");
        }

        attempts++;
    }

    if (!inserted) {
        return res.status(500).send("Não foi possível inserir um nome único após várias tentativas.");
    }

    // Consultar todos os registros da tabela 'people'
    const selectSql = `SELECT * FROM people`;
    connection.query(selectSql, (err, results) => {
        if (err) {
            console.error("Erro ao consultar dados:", err);
            return res.status(500).send("Erro ao consultar dados.");
        }

        let response = '<h1>Full Cycle Rocks!</h1><ul>';
        results.forEach(person => {
            response += `<li>${person.name}</li>`;
        });
        response += '</ul>';
        res.send(response);
    });
});

app.listen(port, () => {
    console.log('Rodando na porta ' + port);
});