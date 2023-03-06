const mongoose = require('mongoose')

const pointSchema = new mongoose.Schema({
	timestamp: Number,
	coords: {
		latitude: Number,
		longitude: Number,
		altitude: Number,
		accuracy: Number,
		heading: Number,
		speed: Number,
	},
})

const trackSchema = new mongoose.Schema({
	userId: {
		// This is a way to indicate that userId is a reference to some other object stored inside MongoDB
		type: mongoose.Schema.Types.ObjectId,
		// ref is used specifically by mongoose and it tells that userId is pointing at an instance
		// of the "User" schema
		ref: 'User',
	},
	name: {
		type: String,
		default: '',
	},
	locations: [pointSchema],
})

// This will associate the mongoose schema with the actual MongoDB schema
// pointSchema won't be associated because is "embedded" inside trackSchema
mongoose.model('Track', trackSchema)
