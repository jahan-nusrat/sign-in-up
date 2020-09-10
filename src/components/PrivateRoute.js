import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './App';

function PrivateRoute ({ children, ...rest }) {
	const [ loggedIn, setLoggedIn ] = useContext(UserContext);
	console.log(rest);
	return (
		<Route
			{...rest}
			render={({ location }) =>
				loggedIn.email ? (
					children
				) : (
					<Redirect
						to={{
							pathname : '/login',
							state    : { from: location.pathname }
						}}
					/>
				)}
		/>
	);
}

export default PrivateRoute;
