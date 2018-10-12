'use strict';

const express = require('express');
const morgan = require('morgan');

const { PORT } = require('./config');
const notesRouter = require('./router/notes.router.js');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());


app.use('/api/notes', notesRouter);

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

if (require.main === module) {
  app
    .listen(PORT, function listen() {
      // eslint-disable-next-line no-console
      console.info(`Server listening on ${this.address().port}`);
    })
    // eslint-disable-next-line no-console
    .on('error', err => console.error(err));
}

module.exports = app;
