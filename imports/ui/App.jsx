import React, { Component, PropTypes } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Pets } from '../api/pets';
import Pet from './Pet.jsx';

// App component - represents the whole app
class App extends Component {

	genSomeData(event) {
		event.preventDefault();
		Meteor.call('pets.generateData');
	}

	renderPets() {
		return this.props.pets.map(pet => (
			<Pet key={pet._id} pet={pet} />
		));
	}

	render() {
		return (
			<div className="container">
				<header>
					<h1><img src="https://www.coffeycomm.com/media/1063/logo-coffey-communications.png" height="51" /> Pets</h1>

					<button onClick={this.genSomeData.bind(this)}>Generate New Data</button>
				</header>

				<ul>
					{this.renderPets()}
				</ul>
			</div>
		);
	}
}

App.propTypes = {
	pets: PropTypes.array.isRequired
};

export default withTracker(props => {
	Meteor.subscribe('allPets');
	return {
		pets: Pets.find({}, {sort: { createdAt: -1 }}).fetch()
	}
})(App);
