const request = require('supertest');
const mongoose = require('mongoose');
const {
  MongoMemoryServer
} = require('mongodb-memory-server');

const app = require('../src/app');
const Ticket = require('../src/models/Ticket');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  await Ticket.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  await mongoServer.stop();
});

describe('POST /tickets', () => {
  test('deve processar e persistir um ticket', async () => {
    const payload = {
      user_email: 'cliente@empresa.com',
      issue_title: 'Sistema fora do ar',
      issue_description:
        'Não consigo acessar o painel de vendas.'
    };

    const response = await request(app)
      .post('/tickets')
      .send(payload);

    expect(response.statusCode).toBe(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.user_email)
      .toBe(payload.user_email);

    const ticket = await Ticket.findOne({
      user_email: payload.user_email
    });

    expect(ticket).not.toBeNull();
    expect(ticket.issue_title)
      .toBe(payload.issue_title);
  });
});


//teste de payload incompleto
test('deve retornar 400 quando o payload estiver incompleto', async () => {
  const payload = {
    user_email: 'cliente@empresa.com'
  };

  const response = await request(app)
    .post('/tickets')
    .send(payload);

  expect(response.statusCode).toBe(400);

  expect(response.body).toHaveProperty('error');
});

//teste falha no banco
test('deve retornar 500 quando o banco falhar', async () => {
  const createSpy = jest
    .spyOn(Ticket, 'create')
    .mockRejectedValue(
      new Error('Database connection failed')
    );

  const payload = {
    user_email: 'cliente@empresa.com',
    issue_title: 'Sistema fora do ar',
    issue_description:
      'Não consigo acessar o sistema.'
  };

  const response = await request(app)
    .post('/tickets')
    .send(payload);

  expect(response.statusCode).toBe(500);

  expect(response.body).toEqual({
    error: 'Internal server error'
  });

  createSpy.mockRestore();
});