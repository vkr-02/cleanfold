import firebase from 'firebase/app';
import 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import firebaseConfig from '../../firebase.config';

//***************** Fire base Initialization ************************
firebase.initializeApp(firebaseConfig);

const AuthContext = createContext();

export const AuthProvider = (props) => {
	const auth = Auth();
	return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

//***************** Redirect review item to signIn ************************
export const PrivateRoute = ({ children, ...rest }) => {
	const auth = useAuth();
	if (auth.loading) {
		return <p>Loading...</p>;
	}
	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth.user ? (
					children
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: location }
						}}
					/>
				)}
		/>
	);
};

export const PrivateAdminRoute = ({ children, ...rest }) => {
	const auth = useAuth();
	if (auth.loading) {
		return <p>Loading...</p>;
	}
	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth.user ? (
					children
				) : (
					<Redirect
						to={{
							pathname: '/admin',
							state: { from: location }
						}}
					/>
				)}
		/>
	);
};

export const getUser = (user) => {
	const { email, displayName, photoURL } = user;
	return { email, name: displayName, photo: photoURL };
};

export const resetPassword = (email) => {
	var auth = firebase.auth();

	auth
		.sendPasswordResetEmail(email)
		.then(function () {
			// Email sent.
		})
		.catch(function (error) {
			// An error happened.
		});
};

const Auth = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const localUser = localStorage.getItem('user');
		if (localUser) {
			setUser(JSON.parse(localUser));
			setLoading(false);
		}

		const unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				const currentUser = user;
				setUser(currentUser);
				setLoading(false);
			} else {
				if (!localStorage.getItem('user')) {
					setUser(null);
					setLoading(false);
				}
			}
		});
		return () => unsubscribe();
	}, []);

	const verifyEmail = () => {
		var user = firebase.auth().currentUser;

		user
			.sendEmailVerification()
			.then(function () {
				// Email sent.
			})
			.catch(function (error) {
				// An error happened.
			});
	};

	//***************** sign in with popup Start ************************
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();

		return firebase
			.auth()
			.signInWithPopup(provider)
			.then((result) => {
				const signedInUser = getUser(result.user);
				setUser(signedInUser);
				window.history.back();
				return result.user;
			})
			.catch((error) => {
				setUser(null);
				return error.message;
			});
	};

	const signInWithFacebook = () => {
		const fbProvider = new firebase.auth.FacebookAuthProvider();

		return firebase
			.auth()
			.signInWithPopup(fbProvider)
			.then((result) => {
				var token = result.credential.accessToken;

				const fbSignedInUser = getUser(result.user);
				setUser(fbSignedInUser);
				window.history.back();
				return result.user;
			})
			.catch(function (error) {
				setUser(null);
				return error.message;
			});
	};

	const signIn = (email, password) => {
		return fetch('http://localhost:5000/signIn', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					localStorage.setItem('user', JSON.stringify(data.user));
					setUser(data.user);
					window.history.back();
					return data.user;
				} else {
					throw new Error(data.error || "Login failed");
				}
			})
			.catch(error => {
				setUser({ error: error.message });
				return error.message;
			});
	};

	const signInAdmin = (email, password) => {
		return fetch('http://localhost:5000/signIn', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					localStorage.setItem('user', JSON.stringify(data.user));
					setUser(data.user);
					window.location.replace("/admin/dashboard");
					return data.user;
				} else {
					throw new Error(data.error || "Login failed");
				}
			})
			.catch(error => {
				setUser({ error: error.message });
				return error.message;
			});
	};

	const signUp = (email, password, name) => {
		return fetch('http://localhost:5000/signUp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, name })
		})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					localStorage.setItem('user', JSON.stringify(data.user));
					setUser(data.user);
					window.history.back();
					return data.user;
				} else {
					throw new Error(data.error || "Registration failed");
				}
			})
			.catch(error => {
				setUser({ error: error.message });
				return error.message;
			});
	};

	const signOut = () => {
		return firebase
			.auth()
			.signOut()
			.then((result) => {
				localStorage.removeItem('user');
				setUser(null);
				return true;
			})
			.catch((error) => {
				console.log(error);
				return error.message;
			});
	};

	return {
		user,
		loading,
		signIn,
		signInAdmin,
		signUp,
		signOut,
		signInWithGoogle,
		signInWithFacebook
	};
};

export default Auth;
