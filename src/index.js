const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authRoutes')
const trackRoutes = require('./routes/trackRoutes')
const requireAuth = require('./middlewares/requireAuth')

const app = express()

app.use(bodyParser.json())

app.use(authRoutes)

app.use(trackRoutes)

const mongoUri = process.env.MONGODB_URI
mongoose.connect(mongoUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
mongoose.connection.on('connected', () => {
	console.log('Connected to MongoDB')
})
mongoose.connection.on('error', (err) => {
	console.error('Error connecting to MongoDB:', err)
})

app.get('/', requireAuth, (req, res) => {
	res.send(`Your email: ${req.user.email}`)
})

module.exports = app

// require('./models/User')
// require('./models/Track')
// require('dotenv').config()

// const express = require('express')
// const mongoose = require('mongoose')
// const bodyParser = require('body-parser')
// const authRoutes = require('./routes/authRoutes')
// const trackRoutes = require('./routes/trackRoutes')
// const requireAuth = require('./middlewares/requireAuth')

// const app = express()

// app.use(bodyParser.json())

// app.use(authRoutes)

// app.use(trackRoutes)

// const mongoUri = process.env.MONGODB_URI
// mongoose.connect(mongoUri)
// mongoose.connection.on('connected', () => {})
// mongoose.connection.on('error', (err) => {})

// app.get('/', requireAuth, (req, res) => {
// 	// This is used in development to see if the JWT was correctly associated
// 	res.send(`Your email: ${req.user.email}`)
// })

// app.listen(3000, () => {})
