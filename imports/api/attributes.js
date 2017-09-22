import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const Attributes = new Mongo.Collection('attributes');

Attributes.schema = new SimpleSchema({
	name: {type: String}
});

Attributes.attachSchema(Attributes.schema);

