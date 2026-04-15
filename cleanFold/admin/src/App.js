import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Customers from './components/AdminPannel/Customer/Customers';
import AdminDashboard from './components/AdminPannel/Dashboard/AdminDashboard';
import AdminLogin from './components/AdminPannel/Login/AdminLogin';
import Registration from './components/AdminPannel/Login/Registration';
import Orders from './components/AdminPannel/Orders/Orders';
import Product from './components/AdminPannel/Products/Products';
import Support from './components/AdminPannel/Support/Support';
import Login from './components/Authentication/Login';
import { AuthProvider, PrivateRoute } from './components/Authentication/useAuth';
import Preloader from './components/Preloader/Preloader';
import { addToDatabaseCart, getDatabaseCart, processOrder, removeFromDatabaseCart } from './utilities/databaseManager';
import allProductItem from './fakeData/allProductItem';
import Feedbacks from './components/AdminPannel/Feedback/Feedbacks';
export const DataContext = createContext();

function App() {
	const [cart, setCart] = useState([]);
	const [order, setOrder] = useState([]);
	const [products, setProducts] = useState([]);
	const [preLoaderVisibility, setPreLoaderVisibility] = useState(true);

	// Using local backend server (http://localhost:5000)
	useEffect(
		() => {
			fetch('http://localhost:5000/allOrders')
				.then((res) => res.json())
				.then((data) => setOrder(data));
		},
		[order.length]
	);

	useEffect(
		() => {
			fetch('http://localhost:5000/products')
				.then((res) => res.json())
				.then((data) => setProducts(data));
			setPreLoaderVisibility(false);
		},
		[products.length]
	);

	const contextData = { order, setOrder, products, setProducts };

	useEffect(() => {
		const savedCart = getDatabaseCart();
		const productKeys = Object.keys(savedCart);

		if (products.length > 0) {
			const previousCart = productKeys.map((existingKey) => {
				const product = products.find((productItem) => productItem.key === existingKey);
				// console.log(existingKey, savedCart[existingKey]);
				product.quantity = savedCart[existingKey];
				return product;
			});
			setCart(previousCart);
		}
	}, []);

	const handleAddProduct = (currentProduct) => {
		const alreadyAdded = cart.find((item) => item.id === currentProduct.id);

		if (alreadyAdded) {
			const reamingCarts = cart.filter((item) => item.id !== currentProduct);
			setCart(reamingCarts);
			addToDatabaseCart(currentProduct.id, currentProduct.quantity);
		} else {
			const newCart = [...cart, currentProduct];
			setCart(newCart);
			addToDatabaseCart(currentProduct.id, currentProduct.quantity);
		}
	};

	const handleRemoveProduct = (currentProduct) => {
		const reamingProducts = cart.filter((item) => item.id !== currentProduct.id);
		setCart(reamingProducts);
		removeFromDatabaseCart(currentProduct.id);
	};

	const [selectedDate, setSelectedDate] = useState(new Date());

	let exactDate = '';

	{
		selectedDate.getDate() > 9 ? (exactDate = selectedDate.getDate()) : (exactDate = `0${selectedDate.getDate()}`);
	}

	const getDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${exactDate}`;
	const getTime = `${selectedDate.getHours() + 1}:00`;

	const [deliveryDetails, setDeliveryDetails] = useState({
		fullName: null,
		email: null,
		mobileNumber: null,
		toDoor: 'Delivery To Door',
		road: null,
		flat: null,
		address: null,
		getDate: getDate,
		getTime: getTime,
		paymentMethod: 'cod',
		transactionId: null
	});

	const deliveryDetailsHandler = (data) => {
		setDeliveryDetails(data);
	};

	const clearCart = () => {
		setCart([]);
		processOrder();
	};

	const clearDeliveryDetails = () => {
		setDeliveryDetails({
			fullName: null,
			email: null,
			mobileNumber: null,
			toDoor: 'Delivery To Door',
			road: null,
			flat: null,
			address: null,
			getDate: getDate,
			getTime: getTime,
			paymentMethod: 'cod',
			transactionId: null
		});
	};

	return (
		<div>
			{preLoaderVisibility ? (
				<div style={{ marginTop: '200px' }}>
					<Preloader />
				</div>
			) : (
				<AuthProvider>
					<DataContext.Provider value={contextData}>
						<Router>
							<Switch>
								<Route exact path="/">
									<AdminLogin />
								</Route>

								<Route exact path="/admin/dashboard">
									<AdminDashboard />
								</Route>

								<Route exact path="/admin/allOrders">
									<Orders />
								</Route>

								<Route exact path="/admin/products">
									<Product />
								</Route>

								<Route exact path="/admin/customers">
									<Customers />
								</Route>

								<Route exact path="/admin/registration">
									<Registration />
								</Route>

								<Route exact path="/admin/support">
									<Support />
								</Route>

								<Route exact path="/admin/feedback">
									<Feedbacks />
								</Route>

								<Route exact path="/login">
									<AdminLogin />
								</Route>

								<Route exact path="/admin">
									<AdminLogin />
								</Route>
							</Switch>
						</Router>
					</DataContext.Provider>
				</AuthProvider>
			)}
		</div>
	);
}

export default App;
