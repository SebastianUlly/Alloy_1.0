import express from 'express'

// const express = require('express')

// // // Create express instance
const app = express()

// // Require API routes
const image = require('./routes/image')

// // Import API Routes
app.use(image)

// // Export the server middleware
module.exports = {
	path: '/api',
	handler: app
}
