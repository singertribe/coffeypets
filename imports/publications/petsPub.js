import {publishComposite} from "meteor/reywood:publish-composite"
import {Pets} from "../api/pets"
import {Attributes} from "../api/attributes"
import {Colors} from "../api/colors"
import {PetTypes} from "../api/petTypes"

// This fancy module allows us to trigger searches to the other collections that pet's can point to.
// In SQL we'd just write a join or something, but MongoDB and Meteor is different. WAY different.
publishComposite('allPets', {
	find() {
		return Pets.find({});
	},
	children: [
		{
			find(pet) {
				return Attributes.find(
					{_id: {$in: pet._attributes.map(it => {return it.id})}}
				)
			}
		},
		{
			find(pet) {
				return Colors.find(
					{_id: {$in: pet._colors}}
				)
			}
		},
		{
			find(pet) {
				return PetTypes.find(
					{_id: pet.petTypeId}
				)
			}
		}
	]
});
