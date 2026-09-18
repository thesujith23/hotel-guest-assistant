import { findFacts, checkAvailability } from './hotelService.js';
import { generateGroundedAnswer } from './aiService.js';
import { validateDates } from './validation.js';
export async function answerChat({ question, history = [], availability }) {
  const q = question.toLowerCase();
  const availabilityIntent = /availability|available|vacancy|room.*(date|night)|stay/.test(q);
  if (availabilityIntent) {
    if (!availability) return { intent: 'clarification', answer: 'I can check that. Please provide your check-in date, check-out date, and number of guests.', grounded: true, needsClarification: true, availability: null, sources: [] };
    const dateError = validateDates(availability); if (dateError) return { intent: 'clarification', answer: dateError, grounded: true, needsClarification: true, availability: null, sources: [] };
    const rooms = await checkAvailability(availability);
    return { intent: 'availability', answer: rooms.length ? `I found ${rooms.length} suitable room type${rooms.length === 1 ? '' : 's'} for your dates.` : 'I couldn’t find a matching room for those dates and guest count.', grounded: true, needsClarification: false, availability: { ...availability, rooms }, sources: ['inventory.mock'] };
  }
  const facts = await findFacts(question); const result = await generateGroundedAnswer({ question, facts, history });
  return { intent: facts.length ? 'knowledge' : 'unsupported', answer: result.answer, grounded: result.grounded, needsClarification: !facts.length, availability: null, sources: facts.map(f => `${f.category}.${f.key}`) };
}
