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

describe('GET /api/players/:id', () => {
  it('should return one player by id', async () => {
    const response = await request(app).get('/api/players/1');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe('Alex Johnson');
  });
});

describe('POST /api/players', () => {
  it('should create a new player', async () => {
    const newPlayer = {
      name: 'Kevin White',
      age: 21,
      position: 'Forward',
      team: 'Farsta',
      goals: 1
    };

    const response = await request(app)
      .post('/api/players')
      .send(newPlayer);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Kevin White');
    expect(response.body.id).toBeDefined();
  });
});

describe('PUT /api/players/:id', () => {
  it('should update a player', async () => {
    const response = await request(app)
      .put('/api/players/1')
      .send({
        name: 'Alex Johnson',
        age: 25,
        position: 'Defender',
        team: 'Farsta',
        goals: 4
      });

    expect(response.status).toBe(200);
    expect(response.body.age).toBe(25);
    expect(response.body.goals).toBe(4);
  });
});

describe('DELETE /api/players/:id', () => {
  it('should delete a player', async () => {
    const response = await request(app)
      .delete('/api/players/2');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Player deleted');
  });
});