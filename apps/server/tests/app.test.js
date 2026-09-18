import request from 'supertest';
import { app } from '../src/app.js';

describe('Hotel assistant API', () => {
  test('health endpoint is safe and available', async () => { const res = await request(app).get('/api/health'); expect(res.status).toBe(200); expect(res.body.status).toBe('ok'); });
  test('answers grounded check-in question', async () => { const res = await request(app).post('/api/chat').send({ question: 'What time is check-in?' }); expect(res.status).toBe(200); expect(res.body.intent).toBe('knowledge'); expect(res.body.answer).toMatch(/3:00 PM/); });
  test('answers an afternoon lunch question from dining facts', async () => { const res = await request(app).post('/api/chat').send({ question: 'Do you have lunch this afternoon?' }); expect(res.status).toBe(200); expect(res.body.answer).toMatch(/lunch|Garden Café|12:00 PM/i); });
  test('responds naturally to a greeting', async () => { const res = await request(app).post('/api/chat').send({ question: 'Hello' }); expect(res.status).toBe(200); expect(res.body.intent).toBe('greeting'); expect(res.body.answer).toMatch(/welcome|help/i); });
  test('returns safe fallback for unsupported question', async () => { const res = await request(app).post('/api/chat').send({ question: 'Who is the president of Mars?' }); expect(res.status).toBe(200); expect(res.body.intent).toBe('unsupported'); expect(res.body.answer).toMatch(/don’t have|hotel details/i); });
  test('asks for missing availability fields', async () => { const res = await request(app).post('/api/chat').send({ question: 'Do you have rooms available?' }); expect(res.body.intent).toBe('clarification'); expect(res.body.needsClarification).toBe(true); });
  test.each(['Can I book a room for 3 guests?', 'Which room is suitable for three adults?', 'Do you have vacancy for my family?', 'Are there rooms for the weekend?'])('recognizes availability wording: %s', async question => { const res = await request(app).post('/api/chat').send({ question }); expect(res.status).toBe(200); expect(res.body.availabilityRequest).toBe(true); expect(res.body.needsClarification).toBe(true); });
  test('returns deterministic availability', async () => { const res = await request(app).post('/api/availability').send({ checkIn: '2026-10-10', checkOut: '2026-10-12', adults: 3 }); expect(res.status).toBe(200); expect(res.body.rooms.length).toBe(2); });
  test('rejects invalid dates', async () => { const res = await request(app).post('/api/availability').send({ checkIn: '2026-10-12', checkOut: '2026-10-10', adults: 2 }); expect(res.status).toBe(400); expect(res.body.error).toBe('INVALID_DATES'); });
  test('handles availability through chat', async () => { const res = await request(app).post('/api/chat').send({ question: 'Are rooms available?', availability: { checkIn: '2026-10-10', checkOut: '2026-10-12', adults: 3 } }); expect(res.body.intent).toBe('availability'); expect(res.body.availability.rooms.length).toBe(2); });
  test('bounds malformed requests', async () => { const res = await request(app).post('/api/chat').send({ question: 'x' }); expect(res.status).toBe(400); expect(res.body.error).toBe('VALIDATION_ERROR'); });
});
