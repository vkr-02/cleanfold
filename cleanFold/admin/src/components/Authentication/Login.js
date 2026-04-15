import { faEnvelope, faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import facebook from '../../images/auth/facebook.svg';
import google from '../../images/auth/google.svg';
import loginPic from '../../images/auth/log.svg';
import registerPic from '../../images/auth/register.svg';
import './Login.css';
import { resetPassword, useAuth } from './useAuth';

const Login = () => {
	const [toggled, setToggled] = useState(false);
	const buttonClass = toggled ? 'containerz sign-up-mode' : 'containerz';
	const [showSignInPassword, setShowSignInPassword] = useState(false);
	const [showSignUpPassword, setShowSignUpPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { register: registerSignIn, handleSubmit: handleSubmitSignIn, watch: watchSignIn, errors: errorsSignIn } = useForm();
	const { register: registerSignUp, handleSubmit: handleSubmitSignUp, watch: watchSignUp, errors: errorsSignUp } = useForm();

	const auth = useAuth();

	const onSubmitOld = (data) => {
		auth.signIn(data.email, data.password);
	};

	const onSubmitNew = (data) => {
		auth.signUp(data.email, data.password, data.name);
	};

	return (
		<section id="Amazing-Login-Page">
			<div className={buttonClass}>
				<div className="forms-containerz">
					<div className="signin-signup">
						<form onSubmit={handleSubmitSignIn(onSubmitOld)} className="sign-in-form">
							<h2 className="title">Sign in</h2>
							{auth.user != null && <p className="text-danger">{auth.user.error}</p>}

							<div className="input-field">
								<FontAwesomeIcon icon={faEnvelope} className="input-fieldi" />
								<input
									name="email"
									ref={registerSignIn({ required: true })}
									placeholder="Email"
								/>
							</div>
							{errorsSignIn.email && <span className="error">Email is required</span>}

							<div className="input-field">
								<FontAwesomeIcon icon={faLock} className="input-fieldi" />
								<input
									type={showSignInPassword ? 'text' : 'password'}
									name="password"
									ref={registerSignIn({ required: true })}
									placeholder="Password"
								/>
								<FontAwesomeIcon
									icon={showSignInPassword ? faEye : faEyeSlash}
									className="password-toggle-auth"
									onClick={() => setShowSignInPassword(!showSignInPassword)}
								/>
							</div>
							{errorsSignIn.password && <span className="error">Password is required</span>}

							<button className="btnz" type="submit">
								Sign In
							</button>

							<p className="forget-text" onClick={() => resetPassword(watchSignIn('email'))}>Forgot your password?</p>

						</form>

						<form onSubmit={handleSubmitSignUp(onSubmitNew)} className="sign-up-form">
							<h2 className="title">Sign up</h2>
							{auth.user != null && <p className="text-danger">{auth.user.error}</p>}

							<div className="input-field">
								<FontAwesomeIcon icon={faUser} className="input-fieldi" />
								<input
									name="name"
									ref={registerSignUp({
										required: "Name is required",
										minLength: { value: 3, message: "Name must be at least 3 characters" }
									})}
									placeholder="Name"
								/>
							</div>
							<span className="error">
								{errorsSignUp.name && errorsSignUp.name.message}
							</span>

							<div className="input-field">
								<FontAwesomeIcon icon={faEnvelope} className="input-fieldi" />
								<input
									name="email"
									ref={registerSignUp({
										required: "Email is required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
											message: "Invalid email address"
										}
									})}
									placeholder="Email"
								/>
							</div>
							<span className="error">
								{errorsSignUp.email && errorsSignUp.email.message}
							</span>

							<div className="input-field">
								<FontAwesomeIcon icon={faLock} className="input-fieldi" />
								<input
									type={showSignUpPassword ? 'text' : 'password'}
									name="password"
									ref={registerSignUp({
										required: "Password is required",
										minLength: { value: 8, message: "Minimum 8 characters required" },
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
											message: "Password must contain uppercase, lowercase, number and special character"
										}
									})}
									placeholder="Password"
								/>
								<FontAwesomeIcon
									icon={showSignUpPassword ? faEye : faEyeSlash}
									className="password-toggle-auth"
									onClick={() => setShowSignUpPassword(!showSignUpPassword)}
								/>
							</div>
							<span className="error">
								{errorsSignUp.password && errorsSignUp.password.message}
							</span>

							<div className="input-field">
								<FontAwesomeIcon icon={faLock} className="input-fieldi" />
								<input
									type={showConfirmPassword ? 'text' : 'password'}
									name="confirm_password"
									ref={registerSignUp({
										required: "Please confirm your password",
										validate: (value) => value === watchSignUp('password') || "Passwords don't match"
									})}
									placeholder="Confirm Password"
								/>
								<FontAwesomeIcon
									icon={showConfirmPassword ? faEye : faEyeSlash}
									className="password-toggle-auth"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								/>
							</div>
							{
								errorsSignUp.confirm_password && <span className="error">Passwords don't match.</span>
							}

							<button className="btnz" type="submit">
								Sign Up
							</button>
						</form>
					</div>
				</div>

				<div className="panels-container">
					<div className="panel left-panel">
						<div className="content">
							<h3>New here ?</h3>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis, ex ratione. Aliquid!
							</p>
							<button className="btnz transparent" onClick={() => setToggled(!toggled)} id="sign-up-btn">
								Sign up
							</button>
						</div>
						<img src={loginPic} className="image" alt="" />
					</div>
					<div className="panel right-panel">
						<div className="content">
							<h3>One of us ?</h3>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laboriosam ad deleniti.
							</p>
							<button className="btnz transparent" onClick={() => setToggled(!toggled)} id="sign-in-btn">
								Sign in
							</button>
						</div>
						<img src={registerPic} className="image" alt="" />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Login;
