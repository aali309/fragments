// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('404 middleware', () => {
  test('wrong routes are forwarded to 404 error!', () =>
    request(app).get('/fragments').expect(404));
});
