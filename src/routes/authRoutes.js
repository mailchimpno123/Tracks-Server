const express = require('express')
// Importing the User schema from mongoose
const mongoose = require('mongoose')
const User = mongoose.model('User')
// Importing JWT
const jwt = require('jsonwebtoken')

// creates a new router object from the express module.
// Routers are a way to modularize your API routes and endpoints by grouping them together based on functionality.
// You can create multiple routers and mount them to different parts of your application.
const router = express.Router()

// sets up a route handler for the POST HTTP method on the /signup endpoint.
// When a client sends a POST request to the /signup endpoint, the function passed as the second argument
// to router.post() is called.
router.post('/signup', async (req, res) => {
	// Destructuring email and password from req.body
	const { email, password } = req.body
	try {
		// Defining a new user with email and password
		const user = new User({ email, password })
		// Asynchronous operation to save the user
		await user.save()
		// Generating token with JWT passing MongoDB auto generated id as userId as first argument
		// and a secret key as second argument
		const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
		// Sending token back
		res.send({ token })
	} catch (err) {
		return res.status(422).send(err.message)
	}
})

// Creating a route for sign in request
router.post('/signin', async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res
			.status(422)
			.send({ error: 'Must provide email and password' })
	}

	const user = await User.findOne({ email })
	if (!user) {
		return res.status(422).send({ error: 'Email not found' })
	}

	try {
		// If the user is found it will have an email and a hashed and salted password attached
		// This will compare the attached password with the one provided by the user
		await user.comparePassword(password)
		// If it is, a token is generated like the sign up example
		const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
		res.send({ token })
	} catch {
		return res.status(422).send({ error: 'Invalid password or email' })
	}
})

// Node syntax to export functions
module.exports = router
