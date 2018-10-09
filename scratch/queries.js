'use strict';

/* eslint-disable no-console */

const data = require('../db/notes');
const simDB = require('../db/simDB');

const notes = simDB.initialize(data);

// Get Notes with search
notes.filter('cats', (err, list) => {
  if (err) {
    console.error(err);
  }

  console.log(list);
});

notes.find(1005, (err, item) => {
  if (err) {
    console.error(err);
  }

  console.log(item || 'not found');
});

// Put (update) notes by ID
const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah',
};
notes.update(1005, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }

  console.log(item || 'not found');
});

// Create note
const newObj = {
  title: 'A new object',
  content: 'Lorem ipsum dolor',
};
notes.create(newObj, (err, item) => {
  if (err) {
    console.error(err);
  }

  console.log(item || 'not found');
});

notes.delete(1020, (err, len) => {
  if (err) {
    console.log(err);
  }

  console.log(len || "wasn't found");
});
