const express = require('express');

const app = express();

app.get('/api/players', (req, res) => {
  res.status(200).json([]);
});

module.exports = app;