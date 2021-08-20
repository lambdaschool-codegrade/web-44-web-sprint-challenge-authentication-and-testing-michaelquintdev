const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
	await db('users').truncate()
});
afterAll(async () => {
  await db.destroy()
})

const newUser = {
  username: 'ayobro',
  password: 'this is not the fresh hot ziti i was promised'
}

// Write your tests here
test('sanity', () => {
  expect(false).toBe(false)
})

describe('[POST] /auth/register', () => {
  it('responds with 400 status if missing username and password', async () => {
    const res = await request(server).post('/api/auth/register').send({})
    expect(res.status).toBe(400)
  })
  it('returns status 201 if created', async () => {
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.status).toBe(201)
  })
})

describe('[POST] /auth/login', () => {
  it('returns a status of 200 if successful', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const res = await request(server).post('/api/auth/login').send(newUser)
    expect(res.status).toBe(200)
  })
  it('responds with token successful', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const res = await request(server).post('/api/auth/login').send(newUser)
    expect(res.body.token).toBeDefined()
  })
})

describe('[GET] /api/jokes', () => {
  it('returns status 200 if everythings cool', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const res = await request(server).post('/api/auth/login').send(newUser)
    const jokesRes = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(jokesRes.status).toBe(200)
  })
  it('returns a list of jokes', async () => {
    await request(server).post('/api/auth/register').send(newUser)
    const res = await request(server).post('/api/auth/login').send(newUser)
    const jokesRes = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(jokesRes.body).toHaveLength(3)
  })
})
