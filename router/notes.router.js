'use strict';

const express = require('express');

const data = require('../db/notes');
const simDB = require('../db/simDB');

const router = express.Router();
const notes = simDB.initialize(data);


function rejectIfFalsy(obj) {
  return obj || Promise.reject();
}

router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  notes
    .filter(searchTerm)
    .then(res.json.bind(res))
    .catch(next);
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

  notes
    .create(newItem)
    .then(rejectIfFalsy)
    .then((item) => {
      res
        .location(`${req.protocol}://${req.headers.host}${req.baseUrl}/${item.id}`)
        .status(201)
        .json(item);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  // simDB does type coercion to number for us
  notes
    .find(req.params.id)
    .then(rejectIfFalsy)
    .then(res.json.bind(res))
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;

  // Validate user input
  const updateObject = {};
  ['title', 'content'].forEach((key) => {
    updateObject[key] = req.body[key];
  });

  if (!updateObject.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    next(err);
    return;
  }

  notes
    .update(id, updateObject)
    .then(rejectIfFalsy)
    .then(res.json.bind(res))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  notes
    .delete(id)
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
