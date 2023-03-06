// This is still a way to import in Node
// In this case, the mongoose User schema and Track schema are imported
// It must be at the top, otherwise it will give an error
require('./models/User')
require('./models/Track')

// Node syntax to import modules
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// Importing the authRoutes route
const authRoutes = require('./routes/authRoutes')
// Importing the trackRoutes route
const trackRoutes = require('./routes/trackRoutes')
// Importing the requireAuth middleware
const requireAuth = require('./middlewares/requireAuth')

const app = express()

// This function is used to handle JSON format everytime an API request with body information is made
// It must be placed above authRoutes because the information must be parsed first
app.use(bodyParser.json())

// Mounts the router to a specific path of the application
// If a client sends a POST request to the '/signup' endpoint of the application (see authRoutes.js),
// the route handler defined in the authRoutes router will be called, and it will send back the response
// with the message 'You made a post request'.
app.use(authRoutes)

app.use(trackRoutes)

// This is a string provided by MongoDB to connect to the DB
// const mongoUri = 'mongodb+srv://admin:admin@cluster0.kbz6vlz.mongodb.net/test'
const mongoUri = process.env.MONGO_URI
// 'mongodb+srv://admin:3kMp82lVg6SoQZlk@cluster0.kbz6vlz.mongodb.net/?retryWrites=true&w=majority'
// Connect to mongoUri
mongoose.connect(mongoUri)
// When connection is established, display connected and a callback function
mongoose.connection.on('connected', () => {
	console.log('Connected to MongoDB instance')
})
// Error handling
mongoose.connection.on('error', (err) => {
	console.error('Error connecting to MongoDB', err)
})

// Anytime a GET HTTP request is made to the root of the App ("/"), the following function is executed
// requireAuth middleware will verify if JWT provided by the user is valid
// If it is, user can access the given route
app.get('/', requireAuth, (req, res) => {
	// This is used in development to see if the JWT was correctly associated
	res.send(`Your email: ${req.user.email}`)
})

// Passing the port as first argument, and a function as second argument
const port = process.env.PORT || 3000
app.listen(port, () => {
	// console.log(`Server running on port ${port}`)
})
