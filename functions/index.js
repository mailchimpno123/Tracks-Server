const functions = require('firebase-functions')
const app = require('./src/index')

exports.app = functions.https.onRequest(app)
