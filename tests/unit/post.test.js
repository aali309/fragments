// tests/unit/get.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('atifhammud@outlook.com', '401098004Tif@')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  test('authenticated users get a fragments array (md)', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('atifhammud@outlook.com', '401098004Tif@')
      .set('Content-Type', 'text/markdown')
      .send('# This is a fragment');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  test('authenticated users get a fragments array (html)', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('atifhammud@outlook.com', '401098004Tif@')
      .set('Content-Type', 'text/html')
      .send('<h1>This is a fragment<h1>');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  test('authenticated users get a fragments array (JSON)', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('atifhammud@outlook.com', '401098004Tif@')
      .set('Content-Type', 'application/json')
      .send('{name: Rad, career: developer}');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
