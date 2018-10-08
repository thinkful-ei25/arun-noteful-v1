'use strict';

const express = require('express');

// Load array of notes
const data = require('./db/notes');

const app = express();

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  const { searchTerm } = req.query;
  if (searchTerm) {
    const loweredSearchTerm = searchTerm.toLowerCase();
    res.json(
      data.filter(
        note => note.title.toLowerCase().includes(loweredSearchTerm)
          || note.content.toLowerCase().includes(loweredSearchTerm),
      ),
    );

    return;
  }

  res.json(data);
});

app.get('/api/notes/:id', (req, res) => {
  res.json(data.find(note => note.id === parseInt(req.params.id, 10)));
});

app
  .listen(8080, function listen() {
    // eslint-disable-next-line no-console
    console.info(`Server listening on ${this.address().port}`);
  })
  // eslint-disable-next-line no-console
  .on('error', err => console.error(err));
