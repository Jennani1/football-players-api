const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(express.json());

const players = [
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

app.get('/api/players', (req, res) => {
  let result = [...players];

  const { position, team } = req.query;

  if (position) {
    result = result.filter(
      player =>
        player.position.toLowerCase() === position.toLowerCase()
    );
  }

  if (team) {
    result = result.filter(
      player =>
        player.team.toLowerCase() === team.toLowerCase()
    );
  }

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit) || 10, 1),
    100
  );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  result = result.slice(startIndex, endIndex);

  res.status(200).json(result);
});

app.get('/api/players/:id', (req, res) => {
  const id = Number(req.params.id);

  const player = players.find(player => player.id === id);

  if (!player) {
    return res.status(404).json({
      message: 'Player not found'
    });
  }

  res.status(200).json(player);
});

app.post(
  '/api/players',
  [
    body('name')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Name is required'),

    body('age')
      .isInt({ min: 15, max: 60 })
      .withMessage('Age must be between 15 and 60'),

    body('position')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Position is required'),

    body('team')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Team is required'),

    body('goals')
      .isInt({ min: 0 })
      .withMessage('Goals must be 0 or higher')
  ],

  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const newPlayer = {
      id: Math.max(0, ...players.map(player => player.id)) + 1,
      name: req.body.name,
      age: Number(req.body.age),
      position: req.body.position,
      team: req.body.team,
      goals: Number(req.body.goals)
    };

    players.push(newPlayer);

    res.status(201).json(newPlayer);
  }
);

app.put('/api/players/:id', (req, res) => {
  const id = Number(req.params.id);

  const player = players.find(player => player.id === id);

  if (!player) {
    return res.status(404).json({
      message: 'Player not found'
    });
  }

  player.name = req.body.name;
  player.age = req.body.age;
  player.position = req.body.position;
  player.team = req.body.team;
  player.goals = req.body.goals;

  res.status(200).json(player);
});

app.delete('/api/players/:id', (req, res) => {
  const id = Number(req.params.id);

  const index = players.findIndex(player => player.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: 'Player not found'
    });
  }

  players.splice(index, 1);

  res.status(200).json({
    message: 'Player deleted'
  });
});

module.exports = app;