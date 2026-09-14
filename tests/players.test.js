const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

const dataPath = path.join(__dirname, '../data/players.json');

const originalPlayers = [
  {
    id: 1,
    name: 'Alex Johnson',
    age: 24,
    position: 'Defender',
    team: 'Farsta',
    goals: 3
  },
  {
    id: 2,
    name: 'Daniel Smith',
    age: 22,
    position: 'Midfielder',
    team: 'Farsta',
    goals: 5
  },
  {
    id: 3,
    name: 'Marcus Brown',
    age: 26,
    position: 'Forward',
    team: 'Stockholm FC',
    goals: 9
  }
];

beforeEach(() => {
  fs.writeFileSync(
    dataPath,
    JSON.stringify(originalPlayers, null, 2)
  );
});

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

describe('Filtering and pagination', () => {
  it('should filter players by position', async () => {
    const response = await request(app)
      .get('/api/players?position=Defender');

    expect(response.status).toBe(200);
    expect(
      response.body.every(
        player => player.position === 'Defender'
      )
    ).toBe(true);
  });

  it('should limit the number of players returned', async () => {
    const response = await request(app)
      .get('/api/players?page=1&limit=2');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(2);
  });
});

describe('Player validation', () => {
  it('should reject a player with missing fields', async () => {
    const response = await request(app)
      .post('/api/players')
      .send({
        name: ''
      });

    expect(response.status).toBe(400);
  });
});