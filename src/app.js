const express = require('express');

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
  res.status(200).json(players);
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

app.post('/api/players', (req, res) => {
  const newPlayer = {
    id: players.length + 1,
    name: req.body.name,
    age: req.body.age,
    position: req.body.position,
    team: req.body.team,
    goals: req.body.goals
  };

  players.push(newPlayer);

  res.status(201).json(newPlayer);
});

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