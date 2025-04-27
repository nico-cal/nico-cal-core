import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server';

describe('Server', () => {
  it('should respond to health check', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      message: 'Server is running'
    });
  });
});
