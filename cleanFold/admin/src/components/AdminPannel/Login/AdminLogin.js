import { faEnvelope, faLock, faLockOpen, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Authentication/useAuth';
import './Signin.css';

import AuthImage from '../../../images/cleanfold_light_illustration.png';

const AdminLogin = () => {
	const { register, handleSubmit, errors } = useForm();
	const [showPassword, setShowPassword] = useState(false);

	const auth = useAuth();

	const onSubmit = (data) => {
		if (data.email && data.password) {
			auth.signInAdmin(data.email, data.password);
		}
	};

	return (
		<div className="admin-login-wrapper">
			{/* Gentle Laundry Theme Bubbles */}
			<div className="water-bubble bubble-1"></div>
			<div className="water-bubble bubble-2"></div>
			<div className="water-bubble bubble-3"></div>

			<div className="admin-login-container">
				<div className="login-split-card">
					{/* Image Box */}
					<div className="login-image-side">
						<div className="illustration-wrapper" style={{ backgroundImage: `url(${AuthImage})` }}></div>
						<div className="image-overlay-text">
							<h2><span className="brand-text">Clean Fold</span> Laundry Management System</h2>
							<p>Delivering pristine cleanliness and smart administration seamlessly.</p>
						</div>
					</div>

					{/* Form Box */}
					<div className="login-form-side">
						<div className="login-form-wrapper">
							<div className="modern-header">
								<h1 className="login-heading">Admin Login</h1>
							</div>

							<form onSubmit={handleSubmit(onSubmit)} className="login-form">
								{auth.user != null && auth.user.error && (
									<div className="error-alert">
										{auth.user.error}
									</div>
								)}

								<div className="floating-input-group">
									<input
										type="email"
										name="email"
										className="floating-input"
										ref={register({ required: true })}
										placeholder=" "
										autoComplete="off"
									/>
									<label className="floating-label">Email Address</label>
									<FontAwesomeIcon icon={faEnvelope} className="input-icon-right" />
									{errors.email && <span className="input-error">Email is required</span>}
								</div>

								<div className="floating-input-group">
									<input
										type={showPassword ? 'text' : 'password'}
										name="password"
										className="floating-input"
										ref={register({ required: true })}
										placeholder=" "
									/>
									<label className="floating-label">Password</label>
									<FontAwesomeIcon
										icon={showPassword ? faLockOpen : faLock}
										className="password-toggle-right"
										onClick={() => setShowPassword(!showPassword)}
									/>
									{errors.password && <span className="input-error">Password is required</span>}
								</div>

								<button className="super-submit-btn" type="submit">
									<span className="btn-text">Log In Securely</span>
									<div className="btn-icon-wrapper">
										<FontAwesomeIcon icon={faSignInAlt} className="btn-icon" />
									</div>
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
