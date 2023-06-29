import React, { useEffect, useState } from 'react';
import "./App.css";
import axios from "axios";
import { TextField, Button, Dialog, DialogContent, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BorderColorIcon from '@mui/icons-material/BorderColor';

const App = () => {
	const [products, setProducts] = useState([]);
	const [produitInfo, setProduitInfo] = useState({
		numProduit: '',
		design: '',
		prix: '',
		quantite: ''
	})
	const [addMod, setAddMod] = useState(false);
	const [confirmDel, setConfirmDel] = useState(false);
	const [idDel, setIdDel] = useState('')
	const [editMod, setEditMod] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [idMod, setIdMod] = useState('')
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [filteredData, setFilteredData] = useState([]);
	const [produitEditedInfo, setProduitEditedInfo] = useState({
		editDesign: '',
		editPrix: '',
		editQuantite: ''
	});
	const [showAllProducts, setShowAllProducts] = useState(true);
	const [priceError, setPriceError] = useState('');
	const [quantityError, setQuantityError] = useState('');
	const [isAnyFieldEmpty, setIsAnyFieldEmpty] = useState(false);
	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === 'prix' && !Number.isInteger(Number(value))) {
			setPriceError('Valeur invalide : if faut un entier');
		  } else {
			setPriceError('');
		  }
		if (name === 'quantite' && !Number.isInteger(Number(value))) {
			setQuantityError('Valeur invalide : if faut un entier');
		} else {
			setQuantityError('');
		}
		if (name === 'prix' || name === 'quantite' || name === 'numProduit' || name === 'design') {
			setIsAnyFieldEmpty(value === '');
		}
		setProduitInfo((prevProducts) => ({
			...prevProducts,
			[name]: value,
		}));
	};

	const handleEditChange = (event) => {
		const { name, value } = event.target;
		if (name === 'prix' && !Number.isInteger(Number(value))) {
			setPriceError('Valeur invalide : if faut un entier');
		  } else {
			setPriceError('');
		  }
		if (name === 'quantite' && !Number.isInteger(Number(value))) {
			setQuantityError('Valeur invalide : if faut un entier');
		} else {
			setQuantityError('');
		}
		const isAnyFieldEmpty = Object.values(produitInfo).some((fieldValue) => fieldValue === '');
			setIsAnyFieldEmpty(isAnyFieldEmpty);
		if (name === 'prix' || name === 'quantite' || name === 'numProduit' || name === 'design') {
			setIsAnyFieldEmpty(value === '');
		}
		setSelectedProduct((prevProduct) => ({
			...prevProduct,
			[name]: value,
		}));
		console.log("PEDT:" +selectedProduct);
	}

	const fetchProducts = async () => {
		try {
			const response = await axios.get('http://localhost:5000/produits/');
			setProducts(response.data);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, );

	const insertProducts = async () => {
		try {
			const response = await axios.post("http://localhost:5000/produits", produitInfo);
			fetchProducts()
			toast.success(response.data.message, { autoClose: 5000 });
			setAddMod(false)
			setProduitInfo('')
		} catch (error) {
			if (error.response) {
				toast.error(error.response.data.error, { autoClose: 5000 });
			} else {
				toast.error('Error occurred while making the request.', { autoClose: 5000 });
			}
		}
	}

	const deleteProducts = async (numProduit) => {
		try {
			const response = await axios.delete(`http://localhost:5000/produits/${numProduit}`);
			fetchProducts()
			toast.success(response.data.message, { autoClose: 5000 });
		} catch (error) {
			if (error.response) {
				toast.error(error.response.data.error, { autoClose: 5000 });
			} else {
				toast.error('Error occurred while making the request.', { autoClose: 5000 });
			}
		}
	}

	const handleSelectProduct = (produitEditedInfo) => {
		setSelectedProduct(produitEditedInfo);
		console.log("In handle:"+produitEditedInfo);
	};

	const editProducts = async (numProduit) => {
		try {
		  const response = await axios.put(
			`http://localhost:5000/produits/${numProduit}`,
			{
				design: selectedProduct.design,
				prix: parseFloat(selectedProduct.prix),
				quantite: parseInt(selectedProduct.quantite),
			}
		  );
		  toast.success(response.data.message, { autoClose: 5000 });
		  fetchProducts();
		  setEditMod(false);
		  setSelectedProduct(null);
		} catch (error) {
			if (error.response) {
				toast.error(error.response.data.error, { autoClose: 5000 });
			} else if (error.message) {
				toast.error(error.message, { autoClose: 5000 });
			} else {
				toast.error('Error occurred while making the request.', { autoClose: 5000 });
			}
		}
	};

	const handleSearch = (searchText) => {
		if (searchText === "" ){
			setShowAllProducts(true);
		} else {
			setShowAllProducts(false);
			const filteredProducts = products.filter((product) =>
			product.numProduit.includes(searchText) || product.design.includes(searchText) || product.prix.toString().includes(searchText));
			setFilteredData(filteredProducts);
		}
	}

	const handleInputChange = (e) => {
		const value = e.target.value;
		setSearchText(value);
		handleSearch(value);
	};

	const retrieveData = async (numProduit) => {
		setIdMod(numProduit);
		const response = await axios.get(`http://localhost:5000/produits/${numProduit}`);
		console.log(response.data)
		const designData = response.data[0].design;
		const prixData = response.data[0].prix;
		const quantiteData = response.data[0].quantite;
		setProduitEditedInfo(() => ({
			'editDesign': designData,
			'editPrix': prixData,
			'editQuantite':quantiteData
		}))
		console.log("IN RETRIEVE"+produitEditedInfo)
	}

	return (
		<>
			<div >
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Button style={{ margin: '50px' }} startIcon={<AddCircleIcon />} size='medium' variant='contained' onClick={() => { setAddMod(true) }}>
						<strong>Ajouter</strong>
					</Button>
					<h1 style={{ textAlign: 'center',color: '#ffff' }}>GESTION PRODUITS</h1>
					<TextField style={{ marginRight: '50px', background: 'rgb(9, 3, 36)', color: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 250, 0.3)'}}
						variant='outlined'
						size="small"
						label={
							<Typography style={{ color: '#ffffff' }}>Recherche</Typography> // Set the label color to white
						}
						InputProps={{
							endAdornment: <SearchIcon fontSize='small' />,style: {
								color: '#ffff'
							}
						}}
						value={searchText}
						onChange={handleInputChange}
						products={products}
					/>
				</div>

				<Dialog size="sx" open={addMod} onClose={() => setAddMod(false)}>

					<DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', justifyContent: 'space-around' }}>
						<h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Ajouter produit</h4>
						<TextField style={{ marginBottom: '15px' }} size='small' label="NumProd" type='text' name="numProduit" value={produitInfo.numProduit} onChange={handleChange} required/>
						<TextField style={{ marginBottom: '15px' }} size='small' label="Design" type='text' name="design" value={produitInfo.design} onChange={handleChange} required/>
						<TextField style={{ marginBottom: '15px' }} size='small' label="Prix" type='text' name="prix" value={produitInfo.prix} onChange={handleChange} error={!!priceError} helperText={priceError} required/>
						<TextField style={{ marginBottom: '15px' }} size='small' label="Quantite" type='text' name="quantite" value={produitInfo.quantite} onChange={handleChange} error={!!quantityError} helperText={quantityError} required/>
						<div>
							<Button style={{ margin: '10px' }} color='success' variant="contained" onClick={insertProducts} disabled={isAnyFieldEmpty || !!priceError || !!quantityError} >
								Valider
							</Button>
							<Button style={{ margin: '10px' }} variant="outlined" color="error" onClick={() => setAddMod(false)}>
								Annuler
							</Button>
						</div>
					</DialogContent>
				</Dialog>

				<Dialog size="md" open={confirmDel} onClose={() => setConfirmDel(false)}>
					<DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', justifyContent: 'space-around' }}>
						<Typography>
							Voulez-vous vraiment supprimer cette enregistrement ?
						</Typography>
						<div>
							<Button style={{ margin: '10px' }} color="secondary" onClick={() => { deleteProducts(idDel); setConfirmDel(false) }}>
								Oui
							</Button>
							<Button style={{ margin: '10px' }} color="error" variant="outlined" size="small" onClick={() => setConfirmDel(false)}>
								Non
							</Button>
						</div>
					</DialogContent>
				</Dialog>

				<Dialog size="md" open={editMod} onClose={() => setEditMod(false)}>

					<DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', justifyContent: 'space-between' }}>
						<h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Modifier produit</h4>
						<TextField style={{ marginBottom: '15px' }} size='small' label="Inchange numProduit" type='text' name='numProduit' value={selectedProduct ? selectedProduct.numProduit : ''} onChange={handleEditChange} disabled />
						<TextField style={{ marginBottom: '15px' }} size='small' label="Nouveau design" type='text' name='design' value={selectedProduct ? selectedProduct.design : ''} onChange={handleEditChange} required/>
						<TextField style={{ marginBottom: '15px' }} size='small' label="Nouveau prix" type='text' name='prix' value={selectedProduct ? selectedProduct.prix : ''} onChange={handleEditChange} error={!!priceError} helperText={priceError} required/>
						<TextField style={{ marginBottom: '15px' }} size='small' label="Nouveau quantite" type='text' name='quantite' value={selectedProduct ? selectedProduct.quantite : ''} onChange={handleEditChange} error={!!quantityError} helperText={quantityError} required/>
						<div>
							<Button style={{ margin: '10px' }} color='success' variant="contained" onClick={() => editProducts(selectedProduct ? selectedProduct.numProduit : '')} disabled={isAnyFieldEmpty || !!priceError || !!quantityError}>
								Valider
							</Button>
							<Button style={{ margin: '10px' }} variant="outlined" color="error" onClick={() => setEditMod(false)}>
								Annuler
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<div style={{ margin: '0px 50px 50px 50px' }}>
				<TableContainer component={Paper} >
					<Table sx={{ minWidth: 700 }} aria-label="spanning table">
						<TableHead>
							<TableRow style={{ textAlign: 'center' }}>
								<TableCell style={{ fontWeight: 'bold' }}>Numéro produit</TableCell>
								<TableCell style={{ fontWeight: 'bold' }}>Designation</TableCell>
								<TableCell style={{ fontWeight: 'bold' }}>Prix</TableCell>
								<TableCell style={{ fontWeight: 'bold' }}>Quantité</TableCell>
								<TableCell style={{ fontWeight: 'bold' }}>Montant</TableCell>
								<TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
							</TableRow>
						</TableHead>
						{showAllProducts ? (
						<TableBody>
							{products.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{row.numProduit}</TableCell>
									<TableCell>{row.design}</TableCell>
									<TableCell>{(row.prix).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}</TableCell>
									<TableCell>{row.quantite}</TableCell>
									<TableCell>{(row.prix * row.quantite).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}</TableCell>
									<TableCell>
										<Button color="secondary" size="small" onClick={() => { setEditMod(true); handleSelectProduct(row); retrieveData(row.numProduit)}} startIcon={<BorderColorIcon fontSize="small" sx={{ fontSize: 15 }}/>}>Editer</Button>
										<Button variant="outlined" color="error" size="small" onClick={() => { setConfirmDel(true); setIdDel(row.numProduit) }}>Supprimer</Button>
									</TableCell>
								</TableRow>
							))}

							<TableRow>
								<TableCell rowSpan={5} />
								<TableCell colSpan={3} style={{ fontWeight: 'bold' }} align='center'>Prix minimal</TableCell>
								<TableCell align="left">
									{Math.min(...products.map((element) => element.prix)).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell colSpan={3} style={{ fontWeight: 'bold' }} align='center'>Prix maximal</TableCell>
								<TableCell align="left">{Math.max(...products.map((element) => element.prix)).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell colSpan={3} style={{ fontWeight: 'bold' }} align='center'>Prix Total</TableCell>
								<TableCell align="left">
									{products.reduce((total, element) => total + element.prix * element.quantite, 0).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}
								</TableCell>
							</TableRow>
						</TableBody>
						) : (
						<TableBody>
						{filteredData.map((row, index) => (
							<TableRow key={index}>
								<TableCell>{row.numProduit}</TableCell>
								<TableCell>{row.design}</TableCell>
								<TableCell>{(row.prix).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}</TableCell>
								<TableCell>{row.quantite}</TableCell>
								<TableCell>{(row.prix * row.quantite).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}</TableCell>
								<TableCell>
									<Button color="secondary" size="small" onClick={() => { setEditMod(true); handleSelectProduct(row) }} sx={{ margin: '20px' }} startIcon={<BorderColorIcon color="secondary" fontSize="small" sx={{ fontSize: 15 }}/>} >Editer</Button>
									<Button variant="outlined" color="error" size="small" onClick={() => { setConfirmDel(true); setIdDel(row.numProduit) }}>Supprimer</Button>
								</TableCell>
							</TableRow>
						))}

						<TableRow>
							<TableCell rowSpan={5} />
							<TableCell colSpan={3} style={{ fontWeight: 'bold' }} align='center'>Prix minimal</TableCell>
							<TableCell align="left">
								{Math.min(...filteredData.map((element) => element.prix)).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={3} style={{ fontWeight: 'bold' }} align='center'>Prix maximal</TableCell>
							<TableCell align="left">{Math.max(...filteredData.map((element) => element.prix)).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={3} style={{ fontWeight: 'bold' }} align='center'>Prix Total</TableCell>
							<TableCell align="left">
								{filteredData.reduce((total, element) => total + element.prix * element.quantite, 0).toLocaleString('en-US', { minimumFractionDigits: 0 }) + " Ar"}
							</TableCell>
						</TableRow>
					</TableBody> )}
					</Table>
				</TableContainer>
			</div>
			<ToastContainer />
		</>
	);
};

export default App;
