import React from 'react';
import { Button, Col, Container, Form, FormGroup, Input, Row } from 'reactstrap';

const ContactUs = () => {
	return (
		<section id="contactUs" className="mb-5">
			<Container>
				<div className="d-flex justify-content-center mb-4">
					<h2 className="text-danger head-title mt-1">Contact Us</h2>
				</div>
				<Row>
					<Col md={6}>
						<Form>
							<FormGroup>
								<label htmlFor="exampleFormControlInput1">Full Name</label>
								<Input id="exampleFormControlInput1" placeholder="Your full name" type="text" />
							</FormGroup>
							<FormGroup>
								<label htmlFor="exampleFormControlInput1">Email Address</label>
								<Input id="exampleFormControlInput1" placeholder="name@example.com" type="email" />
							</FormGroup>
							<FormGroup>
								<label htmlFor="exampleFormControlInput1">Phone Number</label>
								<Input id="exampleFormControlInput1" placeholder="01XXX XXX XXX" type="number" />
							</FormGroup>
							<FormGroup>
								<label htmlFor="exampleFormControlTextarea1">Your Message</label>
								<Input id="exampleFormControlTextarea1" rows="2" type="textarea" />
							</FormGroup>
						</Form>
						<Button color="danger" className="nav-name" type="submit">
							<i className="now-ui-icons ui-1_send" /> Submit
						</Button>
					</Col>
					<Col md={6} className="pl-5">
						<div className="my-4">
							<h6 className="my-3 text-dark">
								Say hello <i className="now-ui-icons ui-2_favourite-28" />
							</h6>
							<h3 className="text-primary">Get in touch, send us an email or call us</h3>
						</div>
						<p>
							Our Vision is to -
							<strong className="text-dark">
								clean laundry in the shortest possible turnaround time
							</strong>
						</p>
						<p>
							Questions? Enquiries? Suggestions? Existential doubts? <br />Our teams are ready to hear
							about them!
						</p>
						<h4 className="text-danger">
							<i className="now-ui-icons tech_mobile" />+91 9876543210
						</h4>
						<h4 className="text-danger">
							<i className="now-ui-icons ui-1_email-85" /> clean.fold@gmail.com
						</h4>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default ContactUs;
