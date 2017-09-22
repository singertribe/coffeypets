import React, { Component, PropTypes } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import {Pets} from "../api/pets"
import Color from "./Color.jsx";
import Attribute from "./Attribute";

// Pet component represents a single Pet in the database
class Pet extends Component {

	deleteThisPet() {
		Pets.remove(this.props.pet._id);
	}

// 	/*
// 	{/*Throw in an "and" before the last color if there are multiple colors*/}
// {this.props.colors.length > 1 && i === this.props.colors.length-1 ? ' and ' : ''}
// {/*Throw in a comma if we're not to the 2nd to last color, yet.*/}
//
// 	 */{i < this.props.colors.length-2 ? ',' : ''}

	renderColors() {
		return this.props.colors.map((color, i) => (
			<Color key={color._id} color={color} />
		));
	}

	renderAttributes() {
		return this.props.pet.attributes().map(att => (
			<Attribute key={att._id} att={att} />
		));
	}

	// The bulk of this is on one line to deal with spacing issues I ran into with React. Unlike HTML where a new line will add a space between elements, JSX apparently does't?
	renderSold() {
		if (this.props.pet.iWasSold()) {
			return (
				<span className="sold-blurb">
					<i className="fa fa-tag fa-fw"></i>
					<strong>SOLD</strong> on {this.props.pet.soldDate.toLocaleDateString()} for <strong>${this.props.pet.salePrice}</strong>
				</span>
			)
		}
	}

	render() {
		const soldClass = this.props.pet.iWasSold() ? 'sold' : '';
		return (
			<li className={soldClass}>
				<button className="delete" onClick={this.deleteThisPet.bind(this)}>
					&times;
				</button>
				<h2 className="pet-name">
					{this.props.pet.name}
				</h2>
				<h3 className="pet-type">
					the <strong>{this.props.pet.isToy ? 'Toy ' : ''}{this.props.pet.petType().name}</strong>{this.props.pet.toySize ? ` (size: ${this.props.pet.toySize})` : ''}, {this.props.pet.weight} lbs {this.renderSold()}
				</h3>
				<div className="colors">
					{this.renderColors()}
				</div>

				<div className="attributes">
					{this.renderAttributes()}
				</div>
			</li>
		);
	}
}

Pet.propTypes = {
	pet: PropTypes.object.isRequired,
	colors: PropTypes.array.isRequired
};

// This withTracker thing adds smarts to the component that handles value updates, new records, etc.
export default withTracker(props => {
	return {
		colors: props.pet.colors().fetch()
	}
})(Pet);
