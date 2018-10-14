'use strict';

const { URL } = require('url');

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

describe('GET /api/:id', function () {
  context('with valid id', function () {
    it('should return a note object with {id, title, content}', function () {
      return chai
        .request(app)
        .get('/api/notes/1000')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('id', 'title', 'content');
        });
    });

    it('should return a note object with the correct id', function () {
      return chai
        .request(app)
        .get('/api/notes/1000')
        .then((res) => {
          expect(res.body.id).to.equal(1000);
        });
    });
  });

  context('with invalid id', function () {
    it('should respond with HTTP Status: 404', function () {
      function testFor404(res) {
        expect(res).to.have.status(404);
        expect(res).to.not.have.key('body');
      }

      return chai
        .request(app)
        .get('/api/notes/NaN')
        .then(testFor404)
        .then(() => chai.request(app).get('/api/notes/2000'))
        .then(testFor404);
    });
  });
});

describe('POST /api/notes', function () {
  context('with valid data', function () {
    beforeEach(function () {
      this.noteFixture = {
        id: 1010,
        title: 'Rabbits > Cats',
        content: 'Everyone knows this',
      };
      this.agent = chai.request(app).keepOpen();
    });

    afterEach(function () {
      this.agent.close();
    });

    it('should create and return a new item', function () {
      return this.agent
        .post('/api/notes')
        .send(this.noteFixture)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.deep.equal(this.noteFixture);
        });
    });

    it('should return a location header corresponding to the new item', function () {
      let location;
      return this.agent
        .post('/api/notes')
        .send(this.noteFixture)
        .then((res) => {
          expect(res).to.have.header('Location');
          location = new URL(res.header.location);
        })
        .then(() => this.agent.get(location.pathname))
        .then((res) => {
          expect(res).to.have.status(200);
          /**
           * Because of the caching behavior of require, simDB will actually not be
           * cleared between calls. The fix would be to load simDB earlier (in app.js)
           * and pass that instance further down the call chain. Then we could use the
           * .on('close') listener to clean up before our tests.
           */
          expect(res.body).to.deep.equal(Object.assign(this.noteFixture, { id: 1011 }));
        });
    });
  });

  context('with missing title field', function () {
    it('should return an object with the correct message field', function () {
      const noteFixture = { id: 1010, content: 'No, dogs are better than rabbits' };
      return chai
        .request(app)
        .post('/api/notes')
        .send(noteFixture)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });
  });
});
