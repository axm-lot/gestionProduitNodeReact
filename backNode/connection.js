const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "*****",
    database: "prod"
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de donnnées :', err);
        return;
    }
    console.log('Connexion à la base 5/5');
});

module.exports = connection;