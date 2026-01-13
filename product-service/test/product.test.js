const request = require('supertest');
const { app, server } = require('../app')

afterAll(() => {
	server.close()
})

describe('Product Service API', () => {
    it('GET /health should return OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
    });

    it('GET /products should return product list', async () => {
        const res = await request(app).get('/products');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
