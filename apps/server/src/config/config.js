import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRootEnv = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../.env');
dotenv.config({ path: projectRootEnv });
export const config = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  aiProvider: process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? 'gemini' : 'openrouter'),
  aiApiKey: process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || '',
  aiApiUrl: process.env.AI_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
  aiModel: process.env.AI_MODEL || (process.env.GEMINI_API_KEY ? 'gemini-2.5-flash' : 'openrouter/free'),
  aiReferer: process.env.AI_REFERER || 'http://localhost:5173',
  aiTitle: process.env.AI_TITLE || 'Harborlight Hotel Guest Assistant'
};

export const demoFacts = [
  { category: 'policy', key: 'check_in', questionVariants: ['check in', 'arrival'], answer: 'Check-in begins at 3:00 PM and check-out is by 11:00 AM.', tags: ['check-in', 'check-out', 'arrival'], sourceLabel: 'Hotel policies' },
  { category: 'amenity', key: 'pool', questionVariants: ['pool', 'swimming'], answer: 'Yes. The hotel has a heated indoor swimming pool open from 6:00 AM to 10:00 PM.', tags: ['pool', 'swimming', 'amenities'], sourceLabel: 'Amenities' },
  { category: 'amenity', key: 'breakfast', questionVariants: ['breakfast', 'morning meal'], answer: 'Breakfast is included with direct bookings and is served from 7:00 AM to 10:30 AM in the Garden Café.', tags: ['breakfast', 'food', 'included'], sourceLabel: 'Dining' },
  { category: 'amenity', key: 'lunch', questionVariants: ['lunch', 'afternoon meal', 'afternoon lunch', 'midday meal', 'today menu'], answer: 'The Garden Café serves lunch from 12:00 PM to 3:00 PM. Today’s specific menu is not connected to the demo, so please ask the front desk for the current menu and availability.', tags: ['lunch', 'afternoon', 'menu', 'dining', 'food'], sourceLabel: 'Dining' },
  { category: 'policy', key: 'cancellation', questionVariants: ['cancel', 'cancellation'], answer: 'Free cancellation is available until 48 hours before arrival. Later cancellations may incur the first night’s charge.', tags: ['cancel', 'cancellation', 'policy'], sourceLabel: 'Cancellation policy' },
  { category: 'property', key: 'location', questionVariants: ['address', 'located', 'location'], answer: 'The fictional Harborlight Hotel is located at 18 Marina Walk, close to the waterfront district.', tags: ['address', 'location'], sourceLabel: 'Property information' },
  { category: 'amenity', key: 'wifi', questionVariants: ['wifi', 'wi-fi', 'internet'], answer: 'Complimentary Wi-Fi is available throughout the hotel. Ask reception for the current access details at check-in.', tags: ['wifi', 'wi-fi', 'internet', 'connection'], sourceLabel: 'Amenities' },
  { category: 'amenity', key: 'gym', questionVariants: ['gym', 'fitness', 'workout'], answer: 'The fitness room is available for hotel guests from 5:00 AM to 11:00 PM.', tags: ['gym', 'fitness', 'workout', 'exercise'], sourceLabel: 'Amenities' },
  { category: 'amenity', key: 'parking', questionVariants: ['parking', 'car park', 'park'], answer: 'On-site parking is available for guests, subject to capacity. Please confirm a space with reception before arrival.', tags: ['parking', 'car', 'vehicle'], sourceLabel: 'Guest services' },
  { category: 'policy', key: 'pets', questionVariants: ['pet', 'pets', 'dog', 'cat'], answer: 'Pet policy details are not configured in this demo. Please contact the hotel before booking to confirm whether your pet can stay.', tags: ['pet', 'pets', 'dog', 'cat', 'animal'], sourceLabel: 'Hotel policies' },
  { category: 'policy', key: 'smoking', questionVariants: ['smoking', 'smoke', 'non-smoking'], answer: 'All guest rooms are non-smoking. Please ask reception about designated outdoor smoking areas.', tags: ['smoking', 'smoke', 'non-smoking'], sourceLabel: 'Hotel policies' },
  { category: 'policy', key: 'children', questionVariants: ['children', 'child', 'kids', 'baby', 'crib'], answer: 'Families are welcome. Crib and extra-bed availability should be confirmed with reception before booking because supplies are limited.', tags: ['children', 'child', 'kids', 'baby', 'crib', 'family'], sourceLabel: 'Hotel policies' },
  { category: 'service', key: 'housekeeping', questionVariants: ['housekeeping', 'cleaning', 'towels', 'room service'], answer: 'Daily housekeeping is provided. You can request extra towels or assistance through reception.', tags: ['housekeeping', 'cleaning', 'towels', 'room service'], sourceLabel: 'Guest services' },
  { category: 'service', key: 'luggage', questionVariants: ['luggage', 'bags', 'baggage', 'storage'], answer: 'Reception can assist with luggage storage before check-in and after check-out, subject to hotel procedures.', tags: ['luggage', 'bags', 'baggage', 'storage'], sourceLabel: 'Guest services' },
  { category: 'service', key: 'accessibility', questionVariants: ['accessible', 'accessibility', 'wheelchair', 'disability'], answer: 'Some rooms are marked accessible in the demo inventory. Please contact the hotel before booking so specific accessibility requirements can be confirmed.', tags: ['accessible', 'accessibility', 'wheelchair', 'disability'], sourceLabel: 'Guest services' },
  { category: 'policy', key: 'payment', questionVariants: ['payment', 'pay', 'card', 'cash'], answer: 'Payment and deposit details are not connected to this demo. The production booking flow should confirm accepted methods before charging a guest.', tags: ['payment', 'pay', 'card', 'cash', 'deposit'], sourceLabel: 'Booking policy' },
  { category: 'service', key: 'transport', questionVariants: ['airport', 'taxi', 'transport', 'transfer'], answer: 'Reception can help arrange local transport, but airport-transfer pricing and availability are not connected to this demo.', tags: ['airport', 'taxi', 'transport', 'transfer', 'shuttle'], sourceLabel: 'Guest services' }
];
export const demoRooms = [
  { code: 'harbor-king', name: 'Harbor King Room', capacity: 2, beds: '1 king bed', accessible: true, rate: 189, totalRooms: 12 },
  { code: 'family-suite', name: 'Family Harbor Suite', capacity: 4, beds: '1 king bed and 1 sofa bed', accessible: true, rate: 279, totalRooms: 6 },
  { code: 'twin-deluxe', name: 'Deluxe Twin Room', capacity: 3, beds: '2 twin beds and 1 rollaway', accessible: false, rate: 229, totalRooms: 8 }
];
export const demoInventory = {
  '2026-10-10:2026-10-12': { 'family-suite': 2, 'twin-deluxe': 4 },
  '2026-10-15:2026-10-18': { 'harbor-king': 5, 'family-suite': 3, 'twin-deluxe': 6 },
  '2026-11-01:2026-11-03': { 'harbor-king': 8, 'twin-deluxe': 3 },
  '2026-11-20:2026-11-25': { 'harbor-king': 2, 'family-suite': 1, 'twin-deluxe': 1 },
  '2026-12-24:2026-12-27': {}
};
