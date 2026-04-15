import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import { useAuth } from '../Authentication/useAuth';
import Cart from './Cart';
import './Cart.css';

const useStyles = makeStyles((theme) => ({
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200,
		marginBottom: theme.spacing(3),
		marginTop: theme.spacing(3)
	}
}));

const Bag = (props) => {

	const auth = useAuth();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const classes = useStyles();

	const [success, setSuccess] = useState(false);

	const [formError, setFormError] = useState('');


	const { fullName, email, mobileNumber, toDoor, road, flat, address, getDate, getTime } = props.deliveryDetails;

	const { register, handleSubmit, errors } = useForm({ mode: 'onChange' });

	const formatDateForInput = (date) => {
		if (!date) return '';
		const d = new Date(date);
		if (isNaN(d.getTime())) return '';
		return d.toISOString().slice(0, 10);
	};

	const parseTimeParts = (timeStr) => {
		if (!timeStr) return { hour: '', min: '00', ampm: 'AM' };
		const trimmed = timeStr.trim();
		const ampmMatch = trimmed.match(/(AM|PM)$/i);
		if (ampmMatch) {
			const parts = trimmed.replace(/(AM|PM)$/i, '').trim().split(':');
			return { hour: parts[0] || '', min: parts[1] || '00', ampm: ampmMatch[0].toUpperCase() };
		}
		if (trimmed.includes(':')) {
			const [hh, mm] = trimmed.split(':');
			let hNum = parseInt(hh, 10);
			const ampm = hNum >= 12 ? 'PM' : 'AM';
			let h12 = hNum % 12;
			if (h12 === 0) h12 = 12;
			return { hour: String(h12), min: mm || '00', ampm };
		}
		return { hour: '', min: '00', ampm: 'AM' };
	};

	const onSubmit = (data) => {
		// Validate date not in past
		const selectedDate = data.getDate ? new Date(`${data.getDate}T00:00:00`) : null;
		const today = new Date();
		const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		if (selectedDate && selectedDate < todayStart) {
			setFormError('Pickup date cannot be in the past.');
			return;
		}

		// Compose time from selects if present
		let composedTime = data.getTime || getTime || '';
		if (data.getHour && data.getMin && data.getAMPM) {
			const hour = parseInt(data.getHour, 10);
			const min = parseInt(data.getMin, 10);
			const ampm = data.getAMPM;
			// convert to 24-hour to validate
			let hour24 = hour % 12;
			if (ampm === 'PM') hour24 += 12;
			if (ampm === 'AM' && hour === 12) hour24 = 0;
			if (hour24 < 9 || hour24 > 18 || (hour24 === 18 && min > 0)) {
				setFormError('Pickup time must be between 9:00 AM and 6:00 PM.');
				return;
			}
			composedTime = `${String(data.getHour).padStart(2, '0')}:${String(data.getMin).padStart(2, '0')} ${data.getAMPM}`;
		}

		// clear errors and persist delivery details
		setFormError('');
		const newUserInfo = { ...props.deliveryDetails };
		if (data.getDate) newUserInfo.getDate = data.getDate;
		if (composedTime) newUserInfo.getTime = composedTime;
		props.deliveryDetailsHandler(newUserInfo);
		setSuccess(true);
		// Removed annoying browser alert
	};

	const handleBlur = (e) => {
		const newUserInfo = { ...props.deliveryDetails };
		newUserInfo[e.target.name] = e.target.value;

		if (newUserInfo.fullName === null) {
			newUserInfo.fullName = auth.user.displayName;
		}

		if (newUserInfo.email === null) {
			newUserInfo.email = auth.user.email;
		}

		props.deliveryDetailsHandler(newUserInfo);

	};

	return (
		<section>
			<Container>
				<Row>
					<Col md={7}>
						<h4 className="font-weight-bold" style={{ color: '#ff3636' }}>
							<i className="now-ui-icons shopping_delivery-fast mr-2" />
							Pickup & Delivery Details
						</h4>
						<hr />

						<div className="address-details px-2 mb-3">
							<form onSubmit={handleSubmit(onSubmit)} className="py-2">
								<div>
									<h5 className="text-danger">
										<i className="now-ui-icons shopping_delivery-fast mr-2" />Schedule
									</h5>
									<span className="from-text">
										Expert will arrive at your given address within 30 minuets
									</span>
								</div>

								<TextField
									name="getDate"
									id="date"
									label="Pickup Date"
									type="date"
									defaultValue={formatDateForInput(getDate)}
									onBlur={handleBlur}
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									inputProps={{
										min: formatDateForInput(new Date())
									}}
								/>

								{/* 12-hour time selects */}
								{(() => {
									const parts = parseTimeParts(getTime);
									return (
										<div className={classes.textField} style={{ display: 'flex', alignItems: 'center' }}>
											<select name="getHour" defaultValue={parts.hour || ''} ref={register({ required: false })} onBlur={handleBlur} className="form-control mr-2" style={{ width: 80 }}>
												<option value="">HH</option>
												{Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
													<option key={h} value={String(h)}>{String(h)}</option>
												))}
											</select>
											<select name="getMin" defaultValue={parts.min || '00'} ref={register({ required: false })} onBlur={handleBlur} className="form-control mr-2" style={{ width: 80 }}>
												{Array.from({ length: 60 / 5 }, (_, i) => String(i * 5).padStart(2, '0')).map((m) => (
													<option key={m} value={m}>{m}</option>
												))}
											</select>
											<select name="getAMPM" defaultValue={parts.ampm || 'AM'} ref={register({ required: false })} onBlur={handleBlur} className="form-control" style={{ width: 100 }}>
												<option value="AM">AM</option>
												<option value="PM">PM</option>
											</select>
										</div>
									);
								})()}
								{formError && <div className="text-danger small mt-1">{formError}</div>}

								<div>
									<h5 className="text-danger">
										<i className="now-ui-icons business_badge mr-2" />Contact Person
									</h5>
									<span className="from-text">Expert will arrive at the address given below</span>
								</div>

								<FormGroup>
									<input
										name="fullName"
										className="form-control my-3"
										ref={register({ required: true })}
										defaultValue={fullName || auth.user.displayName}
										onBlur={handleBlur}
										placeholder="Full Name"
									/>
									{errors.fullName && <span className="errorMessage">Name is required</span>}
								</FormGroup>

								<FormGroup>
									<input
										name="email"
										className="form-control my-3"
										ref={register({ required: true })}
										defaultValue={email || auth.user.email}
										onBlur={handleBlur}
										placeholder="Email"
									/>
									{errors.email && <span className="errorMessage">Email is required</span>}
								</FormGroup>

								<FormGroup>
									<input
										name="mobileNumber"
										className="form-control my-3"
										ref={register({ required: true, pattern: /^[0-9]{10}$/ })}
										defaultValue={mobileNumber}
										onBlur={handleBlur}
										placeholder="Mobile Number"
									/>
									{errors.mobileNumber && errors.mobileNumber.type === 'pattern' && (
										<span className="errorMessage">Mobile Number must be exactly 10 digits</span>
									)}
									{errors.mobileNumber && errors.mobileNumber.type === 'required' && (
										<span className="errorMessage">Mobile Number is required</span>
									)}
								</FormGroup>

								<div className="mt-4">
									<h5 className="text-danger">
										<i className="now-ui-icons location_pin mr-2" />Address
									</h5>
									<span className="from-text">Expert will arrive at the address given below</span>
								</div>

								<FormGroup>
									<input
										name="toDoor"
										className="form-control my-3"
										ref={register({ required: true })}
										defaultValue={toDoor}
										onBlur={handleBlur}
										placeholder="Delivery To Door"
									/>
									{errors.toDoor && <span className="errorMessage">This Option is required</span>}
								</FormGroup>

								<FormGroup>
									<input
										name="road"
										className="form-control my-3"
										ref={register({ required: true })}
										defaultValue={road}
										onBlur={handleBlur}
										placeholder="Road Name"
									/>
									{errors.road && <span className="errorMessage">Road No is required</span>}
								</FormGroup>

								<FormGroup>
									<input
										name="flat"
										className="form-control my-3"
										ref={register({ required: true })}
										defaultValue={flat}
										onBlur={handleBlur}
										placeholder="Flat Name, Room Number or Floor"
									/>
									{errors.flat && (
										<span className="errorMessage">
											Flat Name, Room Number or Floor is required
										</span>
									)}
								</FormGroup>

								<FormGroup>
									<textarea
										name="address"
										ref={register({ required: true })}
										defaultValue={address}
										onBlur={handleBlur}
										placeholder="Address"
										className="form-control my-3"
										cols="30"
										rows="2"
									/>
									{errors.address && <span className="errorMessage">Address is required</span>}
								</FormGroup>

								<div className="mt-4 mb-3">
									<h5 className="text-danger">
										<i className="now-ui-icons business_money-coins mr-2" />Payment Method
									</h5>
									<span className="from-text">Expert will collect your payment after delivery your order</span>
								</div>

								<FormGroup check className="form-check-radio" inline>
									<Label check>
										<Input
											innerRef={register({ required: true })}
											checked={props.deliveryDetails.paymentMethod === 'cod'}
											readOnly
											id="inlineRadio1"
											name="paymentMethod"
											type="radio"
											value="cod"
										/>
										Cash on delivery <span className="form-check-sign" />
									</Label>
								</FormGroup>

								<div className="form-group d-flex justify-content-center mt-4 flex-column align-items-center">
									<button className="btn btn-danger btn-round px-5 font-weight-bold" type="submit" style={{ height: '50px', fontSize: '16px' }}>
										<i className="now-ui-icons ui-1_check mr-2" />
										Save & Continue to Checkout
									</button>
									{success && (
										<div className="alert alert-success mt-3 w-100 text-center animate__animated animate__fadeIn">
											<i className="now-ui-icons ui-2_like mr-2" />
											<b>Success!</b> Your details are saved. Please checkout from the right side bag.
										</div>
									)}
									{Object.keys(errors).length > 0 && (
										<p className="text-danger mt-2 small">
											<b>Please fill all required fields (*) to continue.</b>
										</p>
									)}
								</div>
							</form>
						</div>
					</Col>
					<Col md={5} className="mb-5">
						<Cart
							cart={props.cart}
							deliveryDetails={props.deliveryDetails}
							finalCart={props.finalCart}
							handleAddProduct={props.handleAddProduct}
							handleRemoveProduct={props.handleRemoveProduct}
							finalCartHandler={props.finalCartHandler}
							success={success}
							deliveryDetailsHandler={props.deliveryDetailsHandler}
							clearCart={props.clearCart}
							clearDeliveryDetails={props.clearDeliveryDetails}
						/>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Bag;
