const request = require('supertest');
const app = require('../src/app');

describe('GET /api/players', () => {
  it('should return status 200', async () => {
    const response = await request(app).get('/api/players');

    expect(response.status).toBe(200);
  });
});