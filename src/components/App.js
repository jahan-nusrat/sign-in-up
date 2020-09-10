import React from 'react';
import Home from './Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NotFound from './NotFound';
import PrimarySearchAppBar from './Nav';
import Card from './Card';
import Shipment from './Shipment';
import Next from './Next';
import { createContext } from 'react';
import { useState } from 'react';
import PrivateRoute from './PrivateRoute';

export const UserContext = createContext();

function App () {
	const [ loggedIn, setLoggedIn ] = useState({});
	return (
		<UserContext.Provider value={[ loggedIn, setLoggedIn ]}>
			<Router>
				<Switch>
					<Route exact path="/">
						<PrimarySearchAppBar />
						<h3>{loggedIn.email}</h3>
						<Card />
					</Route>
					<Route path="/login">
						<PrimarySearchAppBar />
						<Home />
					</Route>
					<Route path="/shipment">
						<PrimarySearchAppBar />
						<Shipment />
					</Route>
					<PrivateRoute path="/next">
						<PrimarySearchAppBar />
						<Next />
					</PrivateRoute>
					<Route path="*">
						<NotFound />
					</Route>
				</Switch>
			</Router>
		</UserContext.Provider>
	);
}

export default App;
