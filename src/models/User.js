const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Setting mongoose to work with MongoDB
// We are defining a user schema with properties for email and password
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
})

// ** Hashing and salting the password **

// pre means that this will run before saving the user to the database
userSchema.pre('save', function (next) {
	const user = this
	// If the password hasn't been changed
	if (!user.isModified('password')) {
		// don't do anything
		return next()
	}
	// Adding salt to password. 10 refers to how complex the salt is
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err)
		}
		// Hashing and salting the password
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) {
				next(err)
			}
			user.password = hash
			next()
		})
	})
})

// Comparing the candidatePassword with the password stored inside MongoDB
userSchema.methods.comparePassword = function (candidatePassword) {
	const user = this

	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
			if (err) {
				return reject(err)
			}

			if (!isMatch) {
				return reject(false)
			}

			resolve(true)
		})
	})
}

// This will associate the mongoose schema with the actual MongoDB schema
mongoose.model('User', userSchema)
