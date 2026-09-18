import { z } from 'zod';
const message = z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(1000) });
export const chatSchema = z.object({ question: z.string().trim().min(2).max(1000), history: z.array(message).max(12).default([]), availability: z.object({ checkIn: z.string(), checkOut: z.string(), adults: z.number().int().min(1).max(12) }).optional() });
export const availabilitySchema = z.object({ checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), adults: z.number().int().min(1).max(12) });
export function validateDates({ checkIn, checkOut }) { const start = new Date(`${checkIn}T00:00:00Z`); const end = new Date(`${checkOut}T00:00:00Z`); if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || end <= start) return 'Check-out must be a valid date after check-in.'; return null; }
