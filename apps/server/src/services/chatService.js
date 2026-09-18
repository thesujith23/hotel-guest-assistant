import { findFacts, checkAvailability } from './hotelService.js';
import { generateGroundedAnswer } from './aiService.js';
import { validateDates } from './validation.js';
export async function answerChat({ question, history = [], availability }) {
  const q = question.toLowerCase();
  const greeting = /^(hi|hello|hey|good morning|good afternoon|good evening|how are you|thanks|thank you)\b/.test(q.trim());
  if (greeting) return { intent: 'greeting', answer: 'Hello and welcome to Harborlight Hotel. I can help with check-in, amenities, breakfast, cancellation, room suitability, or availability. What would you like to know?', grounded: true, needsClarification: false, availability: null, sources: ['hotel.welcome'] };
  const availabilityIntent = /availability|available|vacan|room(?:s)?\s+(?:for|on|from|between|during)|which\s+room|room.*(?:fit|suit|sleep)|(?:for|with)\s+\d+\s+(?:adult|guest|people|person|travell?er|occupant)|(?:for|with)\s+(?:one|two|three|four|five|six)\s+(?:adult|guest|people|person)|(?:family|group|couple)\s+(?:room|suite|stay)|check[- ]?in\s+(?:date|on)|check[- ]?out\s+(?:date|on)|booking|book\s+(?:a|one)\s+room|reserve|reservation|night(?:s)?|dates?\s+(?:from|for|on)|stay/.test(q);
  if (availabilityIntent) {
    if (!availability) return { intent: 'clarification', answer: 'I can check that. Please provide your check-in date, check-out date, and number of guests.', grounded: true, needsClarification: true, availabilityRequest: true, availability: null, sources: [] };
    const dateError = validateDates(availability); if (dateError) return { intent: 'clarification', answer: dateError, grounded: true, needsClarification: true, availabilityRequest: true, availability: null, sources: [] };
    const rooms = await checkAvailability(availability);
    return { intent: 'availability', answer: rooms.length ? `I found ${rooms.length} suitable room type${rooms.length === 1 ? '' : 's'} for your dates.` : 'I couldn’t find a matching room for those dates and guest count.', grounded: true, needsClarification: false, availabilityRequest: true, availability: { ...availability, rooms }, sources: ['inventory.mock'] };
  }
  const facts = await findFacts(question); const result = await generateGroundedAnswer({ question, facts, history });
  return { intent: facts.length ? 'knowledge' : 'unsupported', answer: result.answer, grounded: result.grounded, needsClarification: !facts.length, availability: null, sources: facts.map(f => `${f.category}.${f.key}`) };
}
