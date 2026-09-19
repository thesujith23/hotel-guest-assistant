import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'node:crypto';
import { config } from './config/config.js';
import { chatSchema, availabilitySchema, validateDates } from './services/validation.js';
import { answerChat } from './services/chatService.js';
import { checkAvailability } from './services/hotelService.js';
export const app = express();
app.disable('x-powered-by');
app.use(helmet()); 
app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = config.clientOrigin.split(',').map(o => o.trim());
    if (allowed.includes(origin) || allowed.includes('*')) return callback(null, true);
    if (origin.startsWith('https://hotel-guest-assistant') && origin.endsWith('.vercel.app')) return callback(null, true);
    callback(null, false);
  }
})); 
app.use(express.json({ limit: '20kb' }));
app.use((req, res, next) => { req.requestId = crypto.randomUUID(); res.setHeader('X-Request-ID', req.requestId); next(); });
const limiter = rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: true, legacyHeaders: false }); app.use('/api/chat', limiter); app.use('/api/availability', limiter);
app.get('/api/health', (req, res) => res.json({ status: 'ok', knowledgeBase: 'json', ai: config.aiApiKey ? 'configured' : 'fallback-only', aiProvider: config.aiProvider, aiModel: config.aiModel }));
app.post('/api/chat', async (req, res, next) => { try { const parsed = chatSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Please provide a valid question and conversation context.', requestId: req.requestId }); const result = await answerChat(parsed.data); res.json({ requestId: req.requestId, ...result }); } catch (e) { next(e); } });
app.post('/api/availability', async (req, res, next) => { try { const parsed = availabilitySchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Check-in, check-out, and adults are required.', requestId: req.requestId }); const dateError = validateDates(parsed.data); if (dateError) return res.status(400).json({ error: 'INVALID_DATES', message: dateError, requestId: req.requestId }); const rooms = await checkAvailability(parsed.data); res.json({ requestId: req.requestId, ...parsed.data, rooms, message: rooms.length ? `Found ${rooms.length} suitable room type${rooms.length === 1 ? '' : 's'}.` : 'No matching rooms found.' }); } catch (e) { next(e); } });
app.use((err, req, res, next) => { console.error(JSON.stringify({ requestId: req.requestId, error: err.message })); res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.', requestId: req.requestId }); });
