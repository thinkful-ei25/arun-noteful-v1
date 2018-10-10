'use strict';

/* global noteful api store */

$(document).ready(() => {
  noteful.bindEventListeners();

  api.search({}, (response) => {
    store.notes = response;
    noteful.render();
  });
});
