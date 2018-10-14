'use strict';

const chai = require('chai');

const app = require('../server');

const { expect } = chai;
chai.use(require('chai-http'));

describe('GET "/api/notes"', function () {
  it('should return the default of 10 notes as an array', function () {
    return chai
      .request(app)
      .get('/api/notes')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf(10);
      });
  });

  it('should return an array of objects with {id, title, content}', function () {
    return chai
      .request(app)
      .get('/api/notes')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');

        res.body.forEach((note) => {
          expect(note).to.be.an('object');
          expect(note).to.have.all.keys('id', 'title', 'content');
        });
      });
  });

  context('with valid query', function () {
    beforeEach(function () {
      this.agent = chai.request(app).keepOpen();
    });

    afterEach(function () {
      this.agent.close();
      this.agent = null;
    });

    it('should return correct seach results', function () {
      return this.agent
        .get('/api/notes')
        .query({ searchTerm: '5' })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.lengthOf(1);
          expect(res.body[0].id).to.equal(1000);
        })
        .then(() => this.agent.get('/api/notes').query({ searchTerm: 'you' }))
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.lengthOf(8);
        });
    });
  });

  context('with invalid query', function () {
    it('should return an empty array', function () {
      return chai
        .request(app)
        .get('/api/notes')
        .query({ searchTerm: '20' })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.be.empty;
        });
    });
  });
});
