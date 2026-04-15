import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Badge, Col, Row } from 'reactstrap';
import { DataContext } from '../../../App';
import Sidebar from '../Sidebar/Sidebar';
import './Product.css';
import ProductDetails from './ProductDetails';
const containerStyle = {
	backgroundColor: '#F4FDFB',
	height: '100vh'
};

const Product = () => {
	const ContextData = useContext(DataContext);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [viewProduct, setViewProduct] = useState();
	const [selectedService, setSelectedService] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');

	const openOrderModal = (products, service, category) => {
		setModalIsOpen(true);
		setViewProduct(products);
		setSelectedService(service);
		setSelectedCategory(category);
	};

	function closeModal() {
		setModalIsOpen(false);
	}

	function updateModal() {
		setModalIsOpen(false);
		setTimeout(() => {
			setModalIsOpen(true);
		}, 1200);
	}

	useEffect(() => {
		Modal.setAppElement('body');
	}, []);

	const WashAndIronMan = ContextData.products.filter(
		(pd) => pd.service === 'Wash And Iron' && pd.category === "Men's Wear"
	);

	const washAndIronWoman = ContextData.products.filter(
		(pd) => pd.service === 'Wash And Iron' && pd.category === "Women's Wear"
	);

	const washAndFoldMan = ContextData.products.filter(
		(pd) => pd.service === 'Wash And Fold' && pd.category === "Men's Wear"
	);

	const washAndFoldWoman = ContextData.products.filter(
		(pd) => pd.service === 'Wash And Fold' && pd.category === "Women's wear"
	);

	const IronAndFoldMan = ContextData.products.filter(
		(pd) => pd.service === 'Iron And Fold' && pd.category === "Men's Wear"
	);

	const IronAndFoldWoman = ContextData.products.filter(
		(pd) => pd.service === 'Iron And Fold' && pd.category === "Women's Wear"
	);

	const dryCleaningMan = ContextData.products.filter(
		(pd) => pd.service === 'Dry Cleaning' && pd.category === "Men's Wear"
	);

	const dryCleaningWoman = ContextData.products.filter(
		(pd) => pd.service === 'Dry Cleaning' && pd.category === "Women's Wear"
	);

	const EmergencyServiceMan = ContextData.products.filter(
		(pd) => pd.service === 'Emergency Service' && pd.category === "Men's Wear"
	);

	const EmergencyServiceWoman = ContextData.products.filter(
		(pd) => pd.service === 'Emergency Service' && pd.category === "Women's Wear"
	);

	const subscriptionBasedMan = ContextData.products.filter(
		(pd) => pd.service === 'Subscription' && pd.category === "Men's Wear"
	);

	const subscriptionBasedWoman = ContextData.products.filter(
		(pd) => pd.service === 'Subscription' && pd.category === "Women's Wear"
	);

	return (
		<section>
			<div style={containerStyle}>
				<Row>
					<Col md={2}>
						<Sidebar />
					</Col>
					<Col md={10} className="pl-5 pt-4">
						<div className="row d-flex justify-content-between mb-0">
							<h3 className="mt-3 mb-2">
								All Products
								<Badge className="py-2 ml-1" color="info">
									{ContextData.products.length}
								</Badge>
							</h3>

						</div>

						<div className="row mt-2">
							<div className="col-md-3">
								<p className="pt-1 text-elegant">Services</p>
							</div>
							<div className="col-md-3">
								<p className="pt-1 text-elegant">Category's</p>
							</div>
						</div>

						<div className="row mt-2">
							<div className="col-md-3">
								<h3 className="pt-2">Wash & Iron</h3>
							</div>
							<div className="col-md-3">
								<button
									className="btn blue-gradient product-button"
									onClick={() => openOrderModal(WashAndIronMan, 'Wash And Iron', "Men's Wear")}
								>
									Men's Wear
								</button>
							</div>
							<div className="col-md-3">
								<button
									className="btn purple-gradient product-button"
									onClick={() => openOrderModal(washAndIronWoman, 'Wash And Iron', "Women's Wear")}
								>
									Women's Wear
								</button>
							</div>
						</div>

						<div className="row mt-2">
							<div className="col-md-3">
								<h3 className="pt-2">Wash & Fold</h3>
							</div>
							<div className="col-md-3">
								<button
									className="btn blue-gradient product-button"
									onClick={() => openOrderModal(washAndFoldMan, 'Wash And Fold', "Men's Wear")}
								>
									Men's Wear
								</button>
							</div>
							<div className="col-md-3">
								<button
									className="btn purple-gradient product-button"
									onClick={() => openOrderModal(washAndFoldWoman, 'Wash And Fold', "Women's wear")}
								>
									Women's Wear
								</button>
							</div>
						</div>

						<div className="row mt-2">
							<div className="col-md-3">
								<h3 className="pt-2">Iron & Fold</h3>
							</div>
							<div className="col-md-3">
								<button
									className="btn blue-gradient product-button"
									onClick={() => openOrderModal(IronAndFoldMan, 'Iron And Fold', "Men's Wear")}
								>
									Men's Wear
								</button>
							</div>
							<div className="col-md-3">
								<button
									className="btn purple-gradient product-button"
									onClick={() => openOrderModal(IronAndFoldWoman, 'Iron And Fold', "Women's Wear")}
								>
									Women's Wear
								</button>
							</div>
						</div>

						<div className="row mt-2">
							<div className="col-md-3">
								<h3 className="pt-2">Dry Cleaning</h3>
							</div>
							<div className="col-md-3">
								<button
									className="btn blue-gradient product-button"
									onClick={() => openOrderModal(dryCleaningMan, 'Dry Cleaning', "Men's Wear")}
								>
									Men's Wear
								</button>
							</div>
							<div className="col-md-3">
								<button
									className="btn purple-gradient product-button"
									onClick={() => openOrderModal(dryCleaningWoman, 'Dry Cleaning', "Women's Wear")}
								>
									Women's Wear
								</button>
							</div>
						</div>

						<div className="row mt-2">
							<div className="col-md-3">
								<h3 className="pt-2">Emergency</h3>
							</div>
							<div className="col-md-3">
								<button
									className="btn blue-gradient product-button"
									onClick={() => openOrderModal(EmergencyServiceMan, 'Emergency Service', "Men's Wear")}
								>
									Men's Wear
								</button>
							</div>
							<div className="col-md-3">
								<button
									className="btn purple-gradient product-button"
									onClick={() => openOrderModal(EmergencyServiceWoman, 'Emergency Service', "Women's Wear")}
								>
									Women's Wear
								</button>
							</div>
						</div>

						<div className="row mt-2">
							<div className="col-md-3">
								<h3 className="pt-2">Subscription</h3>
							</div>
							<div className="col-md-3">
								<button
									className="btn blue-gradient product-button"
									onClick={() => openOrderModal(subscriptionBasedMan, 'Subscription', "Men's Wear")}
								>
									Men's Wear
								</button>
							</div>
							<div className="col-md-3">
								<button
									className="btn purple-gradient product-button"
									onClick={() => openOrderModal(subscriptionBasedWoman, 'Subscription', "Women's Wear")}
								>
									Women's Wear
								</button>
							</div>
						</div>
					</Col>
				</Row>

				<Modal
					isOpen={modalIsOpen}
					onRequestClose={() => setModalIsOpen(false)}
					style={{
						overlay: {
							backgroundColor: 'rgba(130,125,125,0.75)'
						},
						content: {
							left: '15%',
							width: '70%'
						}
					}}
				>
					{ContextData.products && (
						<ProductDetails
							viewProduct={viewProduct}
							service={selectedService}
							category={selectedCategory}
							closeModal={closeModal}
							updateModal={updateModal}
						/>
					)}
				</Modal>
			</div>
		</section>
	);
};

export default Product;
