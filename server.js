'use strict';

const express = require('express');

const { PORT } = require('./config');
const data = require('./db/notes');
const { logger } = require('./middleware/logger');
const simDB = require('./db/simDB');

const notes = simDB.initialize(data);
const app = express();

app.use(logger);
app.use(express.static('public'));

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, result) => {
    if (err) {
      next(err);
      return;
    }

    res.json(result);
  });
});

app.get('/api/notes/:id', (req, res) => {
  res.json(data.find(note => note.id === parseInt(req.params.id, 10)));
});

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  res.status(err.status).json({ message: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

app
  .listen(PORT, function listen() {
    // eslint-disable-next-line no-console
    console.info(`Server listening on ${this.address().port}`);
  })
  // eslint-disable-next-line no-console
  .on('error', err => console.error(err));
