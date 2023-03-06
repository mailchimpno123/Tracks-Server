// Importing JWT
const jwt = require('jsonwebtoken')
// Importing mongoose User Schema
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
	// Destructuring authorization from the Headers request
	// (in PostMan => Headers => Authorization as Key Bearer as Value)
	// authorization === "Bearer JWT"
	const { authorization } = req.headers

	if (!authorization) {
		return res.status(401).send({ error: 'You must be logged in' })
	}
	// This is used to remove the Bearer prefix from the authorization string
	// so that token === JWT without Bearer
	const token = authorization.replace('Bearer ', '')
	// Veryfing the token passing the token as first argument, the secret key as second argument
	// and a callback async function as third argument
	jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
		if (err) {
			return res.status(401).send({ error: 'You must be logged in' })
		}
		// If there's no error, userId is destructured from payload
		const { userId } = payload
		// Then mongoose attemps to find the userId inside MongoDB
		const user = await User.findById(userId)
		// Finally user is assigned to req.user to handle any other request made by this user
		req.user = user
		// This will call the next middleware insde the middleware chain
		next()
	})
}
