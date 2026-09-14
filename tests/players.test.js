const request = require('supertest');
const app = require('../src/app');

describe('GET /api/players', () => {
  it('should return a list of players', async () => {
    const response = await request(app).get('/api/players');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});