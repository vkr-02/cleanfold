import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import './Footer.css';
import '../../App.css';

const Footer = () => {
    return (
        <footer id="Footer" className="pt-5 pb-3">
            <Container>
                <Row className="mb-4">
                    {/* Brand Column */}
                    <Col xs={12} lg={4} className="mb-4 mb-lg-0">
                        <div className="d-flex align-items-center mb-4">
                            <i className="now-ui-icons tech_tv mr-2 text-danger" style={{ fontSize: '2.2rem' }}></i>
                            <h2 className="m-0 text-white font-weight-bold" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <span className="text-danger">Clean</span> Fold
                            </h2>
                        </div>
                        <p className="footer-description text-secondary">
                            Clean Fold is built on a strong foundation of careful planning, verified laundry processes, and transparent services, ensuring a reliable and seamless experience for every user.
                        </p>
                        <p className="footer-description text-secondary mt-3">
                            Delivering high-quality laundry services backed by experience, accuracy, and user trust.
                        </p>
                    </Col>
                    
                    {/* Support Column */}
                    <Col xs={12} sm={6} lg={2} className="mb-4 mb-sm-0 pl-lg-4">
                        <h5 className="text-white font-weight-bold mb-4 footer-column-heading">Support</h5>
                        <ul className="list-unstyled">
                            <li className="py-1"><a href="/#contactUs" className="footer-link">Get Help</a></li>
                            <li className="py-1"><a href="/#faq" className="footer-link">Read FAQ</a></li>
                            <li className="py-1"><a href="/#ChooseUs" className="footer-link">Terms and Condition</a></li>
                            <li className="py-1"><a href="/#services" className="footer-link">Our Services</a></li>
                            <li className="py-1"><a href="/#contactUs" className="footer-link">Contact</a></li>
                        </ul>
                    </Col>
                    
                    {/* Quick Links Column */}
                    <Col xs={12} sm={6} lg={3} className="mb-4 mb-sm-0 pl-lg-4">
                        <h5 className="text-white font-weight-bold mb-4 footer-column-heading">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li className="py-1"><a href="/#about-us" className="footer-link">About Us</a></li>
                            <li className="py-1"><Link to="/wash-and-iron" className="footer-link">Wash & Iron</Link></li>
                            <li className="py-1"><Link to="/subscription-based" className="footer-link">Subscription Based</Link></li>
                            <li className="py-1"><a href="/#services" className="footer-link">Place Order</a></li>
                            <li className="py-1"><a href="/#works" className="footer-link">How It Works</a></li>
                            <li className="py-1"><Link to="/dashboard" className="footer-link">User Dashboard</Link></li>
                        </ul>
                    </Col>

                    {/* Contact Us Column */}
                    <Col xs={12} lg={3} className="pl-lg-4">
                        <h5 className="text-white font-weight-bold mb-4 footer-column-heading">Contact Us</h5>
                        <ul className="list-unstyled mt-3">
                            <li className="d-flex mb-3 contact-info-item">
                                <i className="now-ui-icons tech_mobile mt-1 text-danger mr-3" style={{ fontSize: '1.2rem' }}></i>
                                <span className="text-secondary">
                                    +91 89764 53212<br />
                                    +91 98236 57392
                                </span>
                            </li>
                            <li className="d-flex mb-3 contact-info-item">
                                <i className="now-ui-icons ui-1_email-85 mt-1 text-danger mr-3" style={{ fontSize: '1.2rem' }}></i>
                                <a href="mailto:clean.fold@gmail.com" className="text-secondary hover-red transition-all">clean.fold@gmail.com</a>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;