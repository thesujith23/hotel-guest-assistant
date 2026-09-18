import { findFacts, checkAvailability } from './hotelService.js';
import { generateGroundedAnswer } from './aiService.js';
import { validateDates } from './validation.js';
export async function answerChat({ question, history = [], availability }) {
  const q = question.toLowerCase();
  const availabilityIntent = /availability|vacan|rooms?\s+available|available\s+rooms|room(?:s)?\s+(?:for|on|from|between|during)|(?:for|with)\s+\d+\s+(?:adult|guest|people|person|travell?er|occupant)|(?:for|with)\s+(?:one|two|three|four|five|six)\s+(?:adult|guest|people|person)|(?:family|group|couple)\s+(?:room|suite|stay)\s+(?:for|on|from|between|during)|check[- ]?in\s+(?:date|on)|check[- ]?out\s+(?:date|on)|booking|book\s+(?:a|one)\s+room|reserve|reservation|night(?:s)?|dates?\s+(?:from|for|on)|stay/.test(q);
  if (availabilityIntent) {
    if (!availability) return { intent: 'clarification', answer: 'I can check that. Please provide your check-in date, check-out date, and number of guests.', grounded: true, needsClarification: true, availabilityRequest: true, availability: null, sources: [] };
    const dateError = validateDates(availability); if (dateError) return { intent: 'clarification', answer: dateError, grounded: true, needsClarification: true, availabilityRequest: true, availability: null, sources: [] };
    const rooms = await checkAvailability(availability);
    return { intent: 'availability', answer: rooms.length ? `I found ${rooms.length} suitable room type${rooms.length === 1 ? '' : 's'} for your dates.` : 'I couldn\'t find a matching room for those dates and guest count.', grounded: true, needsClarification: false, availabilityRequest: true, availability: { ...availability, rooms }, sources: ['inventory.mock'] };
  }
  const facts = await findFacts(question); const result = await generateGroundedAnswer({ question, facts, history });
  return { intent: facts.length ? 'knowledge' : result.usedModel ? 'general' : 'unsupported', answer: result.answer, grounded: result.grounded, usedModel: result.usedModel, aiStatus: result.aiStatus, needsClarification: !facts.length && !result.usedModel, availability: null, sources: facts.map(f => `${f.category}.${f.key}`) };
}
