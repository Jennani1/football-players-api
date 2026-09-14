const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const dataPath = path.join(__dirname, '../data/players.json');

function readPlayers() {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
}

function writePlayers(players) {
  fs.writeFileSync(dataPath, JSON.stringify(players, null, 2));
}

const playerValidation = [
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
];


// GET ALL + FILTERING + PAGINATION
app.get('/api/players', (req, res) => {
  try {
    const players = readPlayers();
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

    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const startIndex = (page - 1) * limit;

    result = result.slice(
      startIndex,
      startIndex + limit
    );

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      message: 'Could not read player data'
    });
  }
});


// GET ONE
app.get('/api/players/:id', (req, res) => {
  try {
    const players = readPlayers();
    const id = Number(req.params.id);

    const player = players.find(
      player => player.id === id
    );

    if (!player) {
      return res.status(404).json({
        message: 'Player not found'
      });
    }

    res.status(200).json(player);

  } catch (error) {
    res.status(500).json({
      message: 'Could not read player data'
    });
  }
});


// POST
app.post(
  '/api/players',
  playerValidation,

  (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const players = readPlayers();

      const newPlayer = {
        id:
          Math.max(
            0,
            ...players.map(player => player.id)
          ) + 1,

        name: req.body.name,
        age: Number(req.body.age),
        position: req.body.position,
        team: req.body.team,
        goals: Number(req.body.goals)
      };

      players.push(newPlayer);
      writePlayers(players);

      res.status(201).json(newPlayer);

    } catch (error) {
      res.status(500).json({
        message: 'Could not save player'
      });
    }
  }
);


// PUT
app.put(
  '/api/players/:id',
  playerValidation,

  (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const players = readPlayers();
      const id = Number(req.params.id);

      const player = players.find(
        player => player.id === id
      );

      if (!player) {
        return res.status(404).json({
          message: 'Player not found'
        });
      }

      player.name = req.body.name;
      player.age = Number(req.body.age);
      player.position = req.body.position;
      player.team = req.body.team;
      player.goals = Number(req.body.goals);

      writePlayers(players);

      res.status(200).json(player);

    } catch (error) {
      res.status(500).json({
        message: 'Could not update player'
      });
    }
  }
);


// DELETE
app.delete('/api/players/:id', (req, res) => {
  try {
    const players = readPlayers();
    const id = Number(req.params.id);

    const index = players.findIndex(
      player => player.id === id
    );

    if (index === -1) {
      return res.status(404).json({
        message: 'Player not found'
      });
    }

    players.splice(index, 1);
    writePlayers(players);

    res.status(200).json({
      message: 'Player deleted'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Could not delete player'
    });
  }
});

module.exports = app;