import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App () {
	const provider = new firebase.auth.GoogleAuthProvider();
	const [ user, setUser ] = useState({
		isSignedIn  : false,
		displayName : '',
		email       : '',
		password    : '',
		photoURL    : '',
		error       : '',
		success     : false
	});
	const handleSignIn = () => {
		firebase.auth().signInWithPopup(provider).then((result) => {
			const { displayName, email, photoURL } = result.user;
			setUser({
				isSignedIn  : true,
				displayName,
				email,
				photoURL
			});
		});
	};

	const handleSignOut = () => {
		firebase.auth().signOut().then((res) => {
			setUser(!user);
		});
	};

	const handleBlur = (e) => {
		let formValid = true;
		if (e.target.name === 'email') {
			formValid = /\S+@\S+\.\S+/.test(e.target.value);
		}
		if (e.target.name === 'password') {
			const validPass = e.target.value.length > 6;
			const hasNumber = /\d{1}/.test(e.target.value);
			formValid = validPass && hasNumber;
		}
		if (formValid) {
			const newUser = { ...user };
			newUser[e.target.name] = e.target.value;
			setUser(newUser);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (user.email && user.password) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(user.email, user.password)
				.then((res) => {
					let newUserInfo = { ...user };
					newUserInfo.error = '';
					newUserInfo.success = true;
					setUser(newUserInfo);
				})
				.catch((error) => {
					let newError = { ...user };
					newError.error = error.message;
					newError.success = false;
					setUser(newError);
				});
		}
	};

	return (
		<div style={{ width: '500px', margin: 'auto' }}>
			{user.isSignedIn && (
				<div>
					<p>Welcome, {user.displayName}</p>
					<img style={{ height: '60px', width: '60px', borderRadius: '50px' }} src={user.photoURL} alt="" />
				</div>
			)}

			<h1>Our own Authentication System</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="Email">Email</label>
				<br />
				<input onBlur={handleBlur} name="email" type="text" placeholder="email address" required />
				<br />
				<br />
				<label htmlFor="password">Password</label>
				<br />
				<input name="password" onBlur={handleBlur} type="password" placeholder="password" required />
				<br />
				<br />
				<input type="submit" value="Submit" />
			</form>

			{user.isSignedIn ? (
				<button onClick={handleSignOut}>Log Out</button>
			) : (
				<button onClick={handleSignIn}>Sign In</button>
			)}
			<p style={{ color: 'red' }}>{user.error}</p>
			{user.success && <p style={{ color: 'green' }}>Success</p>}
		</div>
	);
}

export default App;
