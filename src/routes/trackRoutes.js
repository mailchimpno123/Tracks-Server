const requireAuth = require('../middlewares/requireAuth')
const express = require('express')
const mongoose = require('mongoose')

// This is not imported in the common way to prevent multiple tracks to be created
// by the same user at the same time
// It's imported inside index.js the same way as User schema
const Track = mongoose.model('Track')

const router = express.Router()

router.use(requireAuth)

router.get('/tracks', async (req, res) => {
	// Finding all the tracks from specific user
	const tracks = await Track.find({
		userId: req.user._id,
	})
	// This will be an array of tracks
	res.send(tracks)
})

router.post('/tracks', async (req, res) => {
	const { name, locations } = req.body

	if (!name || !locations) {
		return res
			.status(422)
			.send({ error: 'You must provide a name and locations' })
	}

	try {
		const track = new Track({ name, locations, userId: req.user._id })
		await track.save()
		res.send(track)
	} catch (err) {
		res.status(422).send({ error: err.message })
	}
})

module.exports = router
