import React from 'react';
import { Link, useHistory } from 'react-router-dom';

function Shipment () {
	const history = useHistory();
	const handleNext = () => {
		history.push('/next');
	};
	return (
		<div>
			<h1>This is Shipment page</h1>

			<button style={{ cursor: 'pointer' }} onClick={handleNext}>
				Next Page
			</button>
		</div>
	);
}

export default Shipment;
