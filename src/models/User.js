const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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

userSchema.pre('save', function (next) {
	const user = this
	if (!user.isModified('password')) {
		return next()
	}
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err)
		}
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
