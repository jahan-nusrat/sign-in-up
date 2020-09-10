import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './config';
import { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from './App';
import { useHistory, useLocation } from 'react-router-dom';

firebase.initializeApp(firebaseConfig);

function Home () {
	const provider = new firebase.auth.GoogleAuthProvider();
	const fbProvider = new firebase.auth.FacebookAuthProvider();

	const [ loggedIn, setLoggedIn ] = useContext(UserContext);
	const history = useHistory();
	const location = useLocation();
	console.log(location);
	const { from } = location.state || { from: { pathname: '/' } };

	const [ newUser, setNewUser ] = useState(false);

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
		if (newUser && user.email && user.password) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(user.email, user.password)
				.then((res) => {
					console.log(res);
					let newUserInfo = { ...user };
					newUserInfo.error = '';
					newUserInfo.success = true;
					setUser(newUserInfo);
					updateUserName(user.name);
				})
				.catch((error) => {
					let newError = { ...user };
					newError.error = error.message;
					newError.success = false;
					setUser(newError);
				});
		}
		if (!newUser && user.email && user.password) {
			firebase
				.auth()
				.signInWithEmailAndPassword(user.email, user.password)
				.then((res) => {
					let newUserInfo = { ...user };
					newUserInfo.error = '';
					newUserInfo.success = true;
					setUser(newUserInfo);
					setLoggedIn(newUserInfo);
					history.replace(from);
				})
				.catch((error) => {
					let newError = { ...user };
					newError.error = error.message;
					newError.success = false;
					setUser(newError);
				});
		}
	};

	const updateUserName = (name) => {
		const user = firebase.auth().currentUser;
		user
			.updateProfile({
				displayName : name
			})
			.then(() => {
				console.log('updated');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleFbClick = () => {
		firebase.auth().signInWithPopup(fbProvider).then((res) => {
			console.log(res);
		});
	};

	return (
		<div style={{ width: '500px', margin: '3rem auto', textAlign: 'center' }}>
			{user.isSignedIn && (
				<div>
					<p>Welcome, {user.displayName}</p>
					<img style={{ height: '60px', width: '60px', borderRadius: '50px' }} src={user.photoURL} alt="" />
				</div>
			)}
			{user.isSignedIn ? (
				<button onClick={handleSignOut}>Log Out</button>
			) : (
				<button onClick={handleSignIn}>Sign In</button>
			)}
			<button onClick={handleFbClick}>Sign in with Facebook</button>
			<h1>Our own Authentication System</h1>
			<input onChange={() => setNewUser(!newUser)} type="checkbox" name="user" id="" />
			<label htmlFor="user">New User Sign Up</label> <br />
			<form onSubmit={handleSubmit}>
				{newUser && <input onBlur={handleBlur} type="text" name="name" />}
				<br />
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
				<input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
			</form>
			<p style={{ color: 'red' }}>{user.error}</p>
			{user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>}
		</div>
	);
}

export default Home;
