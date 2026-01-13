const express = require('express')
const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
	res.json({ status: 'OK', service: 'user-service' })
})

app.get('/users', (req, res) => {
	res.json([
		{ id: 1, name: 'Alice' },
		{ id: 2, name: 'Bob' }
	])
})

const PORT = 3000
const server = app.listen(PORT, () => {
	console.log(`User service running on port ${PORT}`)
})

module.exports = { app, server }
