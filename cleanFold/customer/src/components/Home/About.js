import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import '../../App.css';
import './About.css';
import Logo from '../../images/logo.png';

const About = () => {
	return (
		<section id="about-us" className="py-5 bg-light-soft">
			<Container className="my-5">
				<div className="text-center mb-5">
					<h2 className="section-title text-danger font-weight-bold">About Us</h2>
					<p className="section-subtitle text-muted mt-3">Discover the story behind your premium laundry service</p>
				</div>
				<Row className="align-items-center">
					<Col md={6} className="mb-5 mb-md-0">
						<div className="about-image-wrapper">
							<div className="logo-glow"></div>
							<img src={Logo} alt="Clean Fold Logo" className="about-logo" />
						</div>
					</Col>
					<Col md={6}>
						<div className="about-content-card">
							<h3 className="about-heading mb-4 text-dark font-weight-bold">
								Redefining Laundry <br/>
								<span className="text-danger">For the Modern Era</span>
							</h3>
							<p className="about-text text-secondary mb-3">
								<strong>Clean Fold</strong> is the premier Online Laundry Platform, utilizing the latest technology in washing, dry cleaning, and general laundry care to keep your wardrobe spotless. 
							</p>
							<p className="about-text text-secondary mb-4">
								Our services combine deep industry expertise with modern convenience to provide you with immaculately clean laundry in the shortest possible time. Enjoy seamless scheduling via our platform, and we'll take care of the free Pick-up and Delivery!
							</p>
							
							<div className="d-flex mb-4">
								<div className="feature-item mr-5">
									<i className="now-ui-icons tech_watch-time text-danger mb-2" style={{fontSize: '28px'}}></i>
									<h6 className="font-weight-bold m-0 text-dark">Fast Turnaround</h6>
								</div>
								<div className="feature-item">
									<i className="now-ui-icons transportation_bus-front-12 text-danger mb-2" style={{fontSize: '28px'}}></i>
									<h6 className="font-weight-bold m-0 text-dark">Free Delivery</h6>
								</div>
							</div>

							<Link to="/services">
								<Button color="danger" className="about-btn-pill about-shadow-danger btn-lg px-4 about-hover-lift mt-2">
									Explore Our Services
								</Button>
							</Link>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default About;
