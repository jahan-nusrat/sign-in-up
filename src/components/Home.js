import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from './App';
import { useHistory, useLocation } from 'react-router-dom';
import { iniFirebase, handleSignIn, handleSignOut, handleFbClick } from './HomeManager';

function Home () {
	iniFirebase();
	const [ loggedIn, setLoggedIn ] = useContext(UserContext);
	const [ newUser, setNewUser ] = useState(false);

	const history = useHistory();
	const location = useLocation();
	console.log(location);
	const { from } = location.state || { from: { pathname: '/' } };

	const [ user, setUser ] = useState({
		isSignedIn  : false,
		displayName : '',
		email       : '',
		password    : '',
		photoURL    : '',
		error       : '',
		success     : false
	});

	const googleSignIn = () => {
		handleSignIn().then((res) => {
			setUser(res);
			setLoggedIn(res);
			history.replace(from);
		});
	};

	const googleSignOut = () => {
		handleSignOut().then((res) => {
			setUser(res);
			setLoggedIn(res);
		});
	};

	const fbSignIn = () => {
		handleFbClick().then((res) => {
			setUser(res);
			setLoggedIn(res);
			history.replace(from);
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
		}
		if (!newUser && user.email && user.password) {
		}
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
				<button onClick={googleSignOut}>Log Out</button>
			) : (
				<button onClick={googleSignIn}>Sign In</button>
			)}
			<button onClick={fbSignIn}>Sign in with Facebook</button>
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
