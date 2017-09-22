import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const PetTypes = new Mongo.Collection('petTypes');

PetTypes.schema = new SimpleSchema({
	name: {type: String}
});

PetTypes.attachSchema(PetTypes.schema);

