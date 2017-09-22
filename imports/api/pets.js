import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {PetTypes} from "./petTypes";
import {Colors} from "./colors";
import {Attributes} from "./attributes";
import _ from 'lodash';

export const Pets = new Mongo.Collection('pets');

Pets.schema = new SimpleSchema({
	name: {type: String},
	petTypeId: {type: String, regEx: SimpleSchema.RegEx.Id},
	weight: {type: Number},
	isToy: {type: Boolean},
	toySize: {type: String, optional: true},
	_colors: {type: [String], regEx: SimpleSchema.RegEx.Id},
	_attributes: {type: [Object]},
	'_attributes.$.id': {type: String, regEx: SimpleSchema.RegEx.Id},
	'_attributes.$.isTrue': {type: Boolean},
	soldDate: {type: Date, optional: true},
	salePrice: {type: Number, optional: true, decimal: true}
});

Pets.attachSchema(Pets.schema);

// Helpers are added to the Pet objects. Kind of like a mixin to the Pet "class." It's a nice place
// to add your links (like petType()) or extra logic (like iWasSold()).
Pets.helpers({
	petType() {
		return PetTypes.findOne({_id: this.petTypeId});
	},
	colors() {
		return Colors.find({_id: {$in: this._colors}})
	},
	attributes() {
		let attr = [];
		this._attributes.forEach(att => {
			const name = Attributes.findOne({_id: att.id}).name;
			attr.push({_id: att.id, name: name, isTrue: att.isTrue});
		});
		return attr;
	},
	iWasSold() {
		return this.hasOwnProperty('soldDate');
	}
});

// Meteor methods run on the server, but are defined in both the client and server so the UI knows how to execute them.
Meteor.methods({
	'pets.generateData'() {
		Colors.remove({});
		Attributes.remove({});
		Pets.remove({});
		PetTypes.remove({});

		Colors.insert({name: "Gray", webColor: "#ccc"});
		Colors.insert({name: "Light Brown", webColor: "#816F48"});
		Colors.insert({name: "Pale Yellow", webColor: "#FFFFee"});
		Colors.insert({name: "White", webColor: "#FFF"});
		Colors.insert({name: "Black", webColor: "#111"});
		Colors.insert({name: "Red", webColor: "#573027"});
		Colors.insert({name: "Dark Brown", webColor: "#392b1c"});
		Colors.insert({name: "Green", webColor: "#558155"});

		const prefixes = _.shuffle(['Plays well with', 'Prefers', 'Likes', 'Runs away from', 'Likes to eat', 'Plays smooth jazz with']);
		const subjects = _.shuffle(['introverts', 'extroverts', 'children', 'octogenarians', 'clowns', '.NET programmers']);
		const toySizes = ['Micro', 'Small', 'Large', 'Huge'];
		const petTypes = ['Dog', 'Cat', 'Rabbit', 'Snake', 'Elephant', 'Alligator', 'Monkey', 'Sea Monkey', 'Developer'];
		const names = _.shuffle(['Poopsy', 'Fluffy', 'Chloe', 'Linus', 'Jasmine', 'Sherlock', 'Peanut', 'Dumbo']);

		petTypes.forEach(petType => {
			PetTypes.insert({name: petType});
		});

		prefixes.forEach((prefix, i) => {
			Attributes.insert({name: prefix + ' ' + subjects[i]});
		});

		// Thank you, https://stackoverflow.com/a/9035732
		function randomDate(start, end) {
			return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
		}

		// I'm sure this isn't exactly efficient...
		const allColors = Colors.find().fetch();
		const allTypes = PetTypes.find().fetch();
		const allAtts = Attributes.find().fetch();

		names.forEach(name => {
			const attCount = Math.ceil(Math.random() * 5);
			const colorCount = Math.ceil(Math.random() * 3);
			const wasSold = (Math.random() > .75);
			const isToy = (Math.random() > .75);

			const pet = {
				name: name,
				petTypeId: _.sample(allTypes)._id,
				weight: Math.ceil(Math.random() * 30) + 1,
				isToy: isToy,
				_colors: _.map(_.sampleSize(allColors, colorCount), c => {
					return c._id;
				}),
				_attributes: _.map(_.sampleSize(allAtts, attCount), a => {
					return {
						id: a._id,
						isTrue: (Math.random() > .5)
					};
				})
			};

			if (wasSold) {
				pet.soldDate = randomDate(new Date(2010, 0, 1), new Date());
				pet.salePrice = Math.ceil(Math.random() * 200) + 0.99;
			}

			if (isToy) {
				pet.toySize = _.sample(toySizes);
			}

			Pets.insert(pet);
		});
	}
});
