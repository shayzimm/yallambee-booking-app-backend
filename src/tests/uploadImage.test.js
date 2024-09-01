import request from 'supertest';
import app from '../app'; 

jest.mock('../config/cloudinaryConfig.js', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({
      secure_url: 'https://example.com/image.jpg'
    })
  }
}));

describe('Image Upload Route Tests', () => {
  it('should upload an image successfully', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('image', 'path/to/your/test/image.jpg');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('File uploaded successfully.');
    expect(response.body.file).toHaveProperty('filename');
    expect(response.body.file).toHaveProperty('path');
    expect(response.body.file).toHaveProperty('size');
  });

  it('should fail if no file is provided', async () => {
    const response = await request(app)
      .post('/upload');

    expect(response.status).toBe(400);
    expect(response.text).toBe('No file uploaded');
  });
});