import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const Colors = new Mongo.Collection('colors');

Colors.schema = new SimpleSchema({
	name: {type: String},
	webColor: {type: String}
});

Colors.attachSchema(Colors.schema);

