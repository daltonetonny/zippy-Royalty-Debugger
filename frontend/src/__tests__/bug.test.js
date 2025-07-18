const request = require('supertest');
const app = require('../App');
const Bug = require('../models/Bug');
const mongoose = require('mongoose');

describe('Bug API', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost/bugtracker_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Bug.deleteMany();
  });

  describe('POST /api/bugs', () => {
    test('should create a new bug', async () => {
      const response = await request(app)
        .post('/api/bugs')
        .send({ title: 'Test bug creation' })
        .expect(201);

      expect(response.body.title).toBe('Test bug creation');
      expect(response.body.status).toBe('open');
    });

    test('should reject invalid bug data', async () => {
      const response = await request(app)
        .post('/api/bugs')
        .send({ title: 'x' }) // Too short
        .expect(400);

      expect(response.body.error).toMatch(/must be at least 5 characters/);
    });
  });

  describe('GET /api/bugs', () => {
    test('should fetch all bugs', async () => {
      await Bug.create([
        { title: 'First bug' },
        { title: 'Second bug' }
      ]);

      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Second bug'); // Should be sorted by date
    });
  });

  describe('PUT /api/bugs/:id', () => {
    test('should update bug status', async () => {
      const bug = await Bug.create({ title: 'Bug to update' });

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send({ status: 'in-progress' })
        .expect(200);

      expect(response.body.status).toBe('in-progress');
    });

    test('should reject invalid status', async () => {
      const bug = await Bug.create({ title: 'Bug with bad status' });

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.error).toMatch(/Invalid status value/);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    test('should delete a bug', async () => {
      const bug = await Bug.create({ title: 'Bug to delete' });

      await request(app)
        .delete(`/api/bugs/${bug._id}`)
        .expect(204);

      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });
  });
});