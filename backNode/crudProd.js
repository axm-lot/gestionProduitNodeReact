const express = require('express');
const conn = require('./connection');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
  
app.use(cors(corsOptions));
// Ajouter un produit
app.post('/produits', (req, res) => {
  const { numProduit, design, prix, quantite } = req.body;
  conn.query(`INSERT INTO Produit (numProduit, design, prix, quantite) VALUES (?, ?, ?, ?)`, [numProduit, design, prix, quantite], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du produit :', err);
      res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
      return;
    }
    res.status(201).json({ message: 'Produit ajouté avec succès' });
  });
});

// Récupérer tous les produits
app.get('/produits', (req, res) => {
  const selectQuery = `SELECT * FROM Produit`;
  conn.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
      return;
    }
    res.status(200).json(results);
  });
});

// Mettre à jour un produit
app.put('/produits/:numProduit', (req, res) => {
  const numProduit = req.params.numProduit;
  const { design, prix, quantite } = req.body;
  conn.query('UPDATE Produit SET design = ?, prix = ?, quantite = ? WHERE numProduit = ?', [design, prix, quantite, numProduit], (err, results) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du produit :', err);
      return res.send('Error updating P');
    }
    res.status(200).json({ message: 'Produit mis à jour avec succès' });
  });
});

// Supprimer un produit
app.delete('/produits/:numProduit', (req, res) => {
  const numProduit = req.params.numProduit;

  const deleteQuery = `DELETE FROM Produit WHERE numProduit = ?`;
  conn.query(deleteQuery, [numProduit], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression du produit :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
      return;
    }
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  });
});

//Pour la recherche
app.get('/produits', (req, res) => {
  const searchQuery = req.query.query;
  const selectQuery = `SELECT * FROM Produit WHERE nomProduit LIKE '%${searchQuery}%' OR design LIKE '%${searchQuery}%' or prix LIKE '%${searchQuery}%'`;
  conn.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche des produits :', err);
      res.status(500).json({ error: 'Erreur lors de la recherche des produits' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/produits/:numProduit', (req, res) => {
  const numProduit = req.params.numProduit;
  conn.query('SELECT * FROM Produit WHERE numProduit = ?', [numProduit], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    res.send(results);
  });
});

app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
