// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('404 Handler', () => {
  it('should return a 404 error response', (done) => {
    request(app)
      .get('/nonexistent-route')
      .expect(404)
      .expect('Content-Type', /json/)
      .expect({
        status: 'error',
        error: {
          message: 'not found',
          code: 404,
        },
      })
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
