import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Input, Label, Modal } from 'reactstrap';
import { DataContext } from '../../App';
import { processOrder } from '../../utilities/databaseManager';
import { useAuth } from '../Authentication/useAuth';
import '../Services/Services.css';
import './Cart.css';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper
	},
	dividerFullWidth: {
		margin: `10px 0 0 ${theme.spacing(0)}px`,
		fontSize: theme.typography.pxToRem(16)
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary
	}
}));

const Cart = (props) => {
	const classes = useStyles();
	const auth = useAuth();
	const ContextData = useContext(DataContext);
	const [agreed, setAgreed] = useState(false);
	const [orderPlaced, setOrderPlaced] = useState(false);

	const removeItemFromCart = (currentItem) => {
		currentItem.dc = 'd-none';
		currentItem.ac = 'd-block';

		props.handleRemoveProduct(currentItem);
	};

	const handleProductQuantity = (productID, productQuantity) => {
		const newCart = ContextData.products.map((item) => {
			if (item.id === productID) {
				item.quantity = productQuantity;
			}
			return item;
		});

		const filteredCart = newCart.find((item) => item.id === productID);
		props.handleAddProduct(filteredCart);
	};

	const totalQuantity = props.cart.reduce((totalQuantity, product) => {
		return totalQuantity + product.quantity;
	}, 0);

	const subTotal = props.cart.reduce((totalPrice, product) => {
		return totalPrice + product.price * product.quantity;
	}, 0);

	let deliveryCharge = 0;
	if (subTotal > 500) {
		deliveryCharge = 0;
	} else if (subTotal > 0) {
		deliveryCharge = 40;
	}


	const grandTotal = subTotal + deliveryCharge;

	// After Place order button is clicked, this function is worked
	const handleFinalOrder = () => {
		if (!agreed) {
			alert('Please agree to Terms and Conditions before placing your order.');
			return;
		}
		const shipment = props.deliveryDetails;
		const products = props.cart;
		const email = auth.user.email;

		const subTotalCart = subTotal + '';
		const deliveryChargeCart = deliveryCharge + '';
		const grandTotalCart = grandTotal + '';

		const price = {
			subTotal,
			deliveryCharge,
			grandTotal
		};

		const orderDetails = Math.round(Math.random() * 1000000);
		const status = 'Order Placed';
		const progress = 20;

		const orderAdded = { email, shipment, products, price, orderDetails, status, progress };

		fetch('http://localhost:5000/addOrders', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(orderAdded)
		})
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					setOrderPlaced(true);
				}
			});

		processOrder();
		props.clearCart();
		props.clearDeliveryDetails();
		setAgreed(false);
	};

	return (
		<div className="cartClass">
			<div className="cart-header text-white">
				<h4>Your Bag</h4>
				<p>Total Item: {totalQuantity}</p>
			</div>

			<List className={classes.root}>
				{props.cart.map((item) => (
					<div key={item.id}>
						<ListItem>
							<Typography
								className={`${classes.dividerFullWidth} cart-item-category`}
								color="textSecondary"
								display="block"
								variant="caption"
							>
								{item.category} - {item.service}
							</Typography>
							<ListItemText primary="" />
							<div className="quantity-button">
								{item.quantity > 1 ? (
									<button
										onClick={() => handleProductQuantity(item.id, item.quantity - 1)}
										className="btnQ"
									>
										-
									</button>
								) : (
									<button className="btnQ" onClick={() => removeItemFromCart(item)}>
										-
									</button>
								)}
								<span className="quantity"> {item.quantity}</span>
								<button
									className="btnQ"
									onClick={() => handleProductQuantity(item.id, item.quantity + 1)}
								>
									+
								</button>
							</div>
						</ListItem>
						<ListItem className="py-0">
							<ListItemText primary={<span className="cart-item-name">{item.name}</span>} />
							<ListItemText primary="" />
							<Typography className={classes.secondaryHeading}>
								<span className="price font-weight-bold">₹ {item.price * item.quantity}</span>
							</Typography>
						</ListItem>
						<Divider className="my-2" />
					</div>
				))}

				<div className="px-3">
					<ListItem className="px-0">
						<ListItemText primary={<span className="text-muted">Sub Total</span>} />
						<Typography className={classes.secondaryHeading}>
							<span className="text-dark font-weight-bold">₹ {subTotal}</span>
						</Typography>
					</ListItem>
					<ListItem className="px-0">
						<ListItemText primary={<span className="text-muted">Delivery Charge</span>} />
						<Typography className={classes.secondaryHeading}>
							<span className="text-dark font-weight-bold">₹ {deliveryCharge}</span>
						</Typography>
					</ListItem>
				</div>

				<div className="grand-total-section mt-3">
					<ListItem className="px-0">
						<ListItemText primary={<h5 className="mb-0 font-weight-bold">Grand Total</h5>} />
						<Typography className={classes.secondaryHeading}>
							<span style={{ fontSize: '22px', color: '#ff3636', fontWeight: '800' }}>₹ {grandTotal}</span>
						</Typography>
					</ListItem>

					{totalQuantity ? props.success ? (
						<div className="mt-3">
							<div className="d-flex justify-content-center">
								<FormGroup check>
									<Label check>
										<Input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
										<span className="form-check-sign" />
										<span className="small text-muted">I agree to Terms and Conditions</span>
									</Label>
								</FormGroup>
							</div>
							<div className="d-flex justify-content-center mt-2">
								<Button
									className={`checkout-btn w-100 ${!agreed ? 'opacity-5' : ''}`}
									disabled={!agreed}
									onClick={handleFinalOrder}
								>
									<i className="now-ui-icons arrows-1_share-66 mr-2" />
									Place Your Order
								</Button>
							</div>
						</div>
					) : (
						<div className="d-flex justify-content-center mt-3">
							<Link to="/cart-and-shipment" className="w-100">
								<Button className="checkout-btn w-100">
									<i className="now-ui-icons shopping_bag-16 mr-2" />
									Continue to Checkout
								</Button>
							</Link>
						</div>
					) : null}
				</div>
			</List>

			{/* Order Success Modal */}
			<Modal isOpen={orderPlaced} toggle={() => setOrderPlaced(false)} centered>
				<div className="modal-body text-center p-5">
					<div className="mb-4">
						<i className="now-ui-icons ui-1_check-circle-08 text-success" style={{ fontSize: '80px' }} />
					</div>
					<h2 className="font-weight-bold text-dark">Thank You!</h2>
					<h4 className="text-secondary mb-4">Your order has been placed successfully.</h4>
					<p className="text-muted mb-5">
						Our expert will arrive at your address shortly. You can track your order status in the dashboard.
					</p>
					<Link to="/dashboard">
						<Button
							className="checkout-btn w-100 py-3"
							style={{ fontSize: '18px' }}
							onClick={() => setOrderPlaced(false)}
						>
							Go to Dashboard
						</Button>
					</Link>
				</div>
			</Modal>
		</div>
	);
};

export default Cart;
