'use strict';

const chai = require('chai');

const app = require('../server');

const { expect } = chai;

chai.use(require('chai-http'));

describe('Express static', function () {
  it('GET "/" should return the index page', function () {
    return chai
      .request(app)
      .get('/')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function () {
  it('should respond with 404 when given a nonexistant path', function () {
    return chai
      .request(app)
      .get('/DoesNotExist')
      .then((res) => {
        expect(res).to.have.status(404);
      });
  });
});
