'use strict';

const express = require('express');

const data = require('../db/notes');
const simDB = require('../db/simDB');

const router = express.Router();
const notes = simDB.initialize(data);

router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, result) => {
    if (err) {
      next(err);
      return;
    }

    res.json(result);
  });
});

router.post('/', (req, res, next) => {
  const { title, content } = req.body;
  const newItem = { title, content };

  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    next(err);
    return;
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      next(err);
      return;
    }

    if (!item) {
      next();
      return;
    }

    res
      .location(`${req.protocol}://${req.headers.host}${req.baseUrl}/${item.id}`)
      .status(201)
      .json(item);
  });
});

router.get('/:id', (req, res, next) => {
  // simDB does type coercion to number for us
  notes.find(req.params.id, (err, item) => {
    if (err) {
      next(err);
      return;
    }
    if (!item) {
      next();
      return;
    }

    res.json(item);
  });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;

  // Validate user input
  const updateObject = {};
  ['title', 'content'].forEach((key) => {
    updateObject[key] = req.body[key];
  });

  notes.update(id, updateObject, (err, updatedItem) => {
    if (err) {
      next(err);
      return;
    }

    if (!updatedItem) {
      next();
      return;
    }

    res.json(updatedItem);
  });
});

module.exports = router;
