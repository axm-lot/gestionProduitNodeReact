# gestionProduitNodeReact
Simple CRUD (Create, Read, Update, Delete) + Search product application.
## Description
This is a simple CRUD application developed for learning purposes, using Node.js and React.
## Features
- Create: Add new products with details like name, price, and quantity.
- Read: View a list of existing products with their information.
- Update: Modify the details of a specific product, including its name, price, and quantity.
- Delete: Remove a product from the database.
- Search: Search data from the existing database.
## Technologies Used
- Front-end: HTML, CSS, JavaScript, React
- Back-end: Node.js, Express.js
- Database: MySQL
- API Communication: Axios
## Setup
1. Clone the repository:
```
    git clone https://github.com/axmcharlot/gestionProduitNodeReact.git
```
2. Navigate to the project directory: `cd gestionProduitNodeReact`

3. Install the dependencies for both the client and server:
```
   cd backNode && npm install #install backend dependencies
   cd ../frontReact && npm install #install the frontend dependencies
```
4. Set up the database:
- Create a MySQL database.
- Import the gestiion_produit.sql
```
mysql -u user_name -p db_name < gestiion_produit.sql
```
- Update the necessary changes
## Usage
In the backNode directory: ` node crudProd.js`
In the frontReact directory: `npm start` 
use  the ` cd ` command if needed
## Acknowledgements
This project was developed as a simple CRUD application for managing product data. It serves as a foundation for more complex product management systems and can be extended with additional features and improvements.