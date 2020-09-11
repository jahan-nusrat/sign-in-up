import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './config';

export const iniFirebase = () => {
	if (firebase.apps.length === 0) {
		firebase.initializeApp(firebaseConfig);
	}
};

export const handleSignIn = () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	return firebase.auth().signInWithPopup(provider).then((result) => {
		const { displayName, email, photoURL } = result.user;
		const signInUser = {
			isSignedIn  : true,
			displayName,
			email,
			photoURL,
			success     : true
		};
		return signInUser;
	});
};

export const handleFbClick = () => {
	const fbProvider = new firebase.auth.FacebookAuthProvider();
	return firebase.auth().signInWithPopup(fbProvider).then((res) => {
		let user = res.user;
		return user;
	});
};

export const handleSignOut = () => {
	firebase.auth().signOut().then((res) => {
		const signOutUser = {
			isSignedIn  : false,
			displayName : '',
			email       : '',
			photoURL    : '',
			error       : '',
			success     : false
		};
		return signOutUser;
	});
};

export const trueNewUser = (name, email, password) => {
	return firebase
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then((res) => {
			console.log(res);
			let newUserInfo = res.user;
			newUserInfo.error = '';
			newUserInfo.success = true;
			return newUserInfo;
			updateUserName(name);
		})
		.catch((error) => {
			let newError = {};
			newError.error = error.message;
			newError.success = false;
		});
};

export const falseNewUser = () => {
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
};

export const updateUserName = (name) => {
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
