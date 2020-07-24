import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(): string[];
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'randomstring';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  // Clear mock data every time test is run
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getAuthCookie = () => {
  // Build a JWT payload { id, email }
  const payload = {
    // Generate random user id
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create a JWT token
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object { jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string that is the cookie with encoded data
  return [`express:sess=${base64}`];
};
