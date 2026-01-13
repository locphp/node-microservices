const request = require('supertest')
const { app, server } = require('../app')

afterAll(() => {
	server.close()
})

describe('User Service API', () => {
	it('GET /health should return OK', async () => {
		const res = await request(app).get('/health')
		expect(res.statusCode).toBe(200)
		expect(res.body.status).toBe('OK')
	})

	it('GET /users should return user list', async () => {
		const res = await request(app).get('/users')
		expect(res.statusCode).toBe(200)
		expect(res.body.length).toBeGreaterThan(0)
	})
})
