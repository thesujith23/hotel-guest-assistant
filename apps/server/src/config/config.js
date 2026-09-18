import 'dotenv/config';
export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || '',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  aiApiKey: process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || '',
  aiApiUrl: process.env.AI_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
  aiModel: process.env.AI_MODEL || 'openrouter/free',
  aiReferer: process.env.AI_REFERER || 'http://localhost:5173',
  aiTitle: process.env.AI_TITLE || 'Harborlight Hotel Guest Assistant'
};

export const demoFacts = [
  { category: 'policy', key: 'check_in', questionVariants: ['check in', 'arrival'], answer: 'Check-in begins at 3:00 PM and check-out is by 11:00 AM.', tags: ['check-in', 'check-out', 'arrival'], sourceLabel: 'Hotel policies' },
  { category: 'amenity', key: 'pool', questionVariants: ['pool', 'swimming'], answer: 'Yes. The hotel has a heated indoor swimming pool open from 6:00 AM to 10:00 PM.', tags: ['pool', 'swimming', 'amenities'], sourceLabel: 'Amenities' },
  { category: 'amenity', key: 'breakfast', questionVariants: ['breakfast', 'morning meal'], answer: 'Breakfast is included with direct bookings and is served from 7:00 AM to 10:30 AM in the Garden Café.', tags: ['breakfast', 'food', 'included'], sourceLabel: 'Dining' },
  { category: 'policy', key: 'cancellation', questionVariants: ['cancel', 'cancellation'], answer: 'Free cancellation is available until 48 hours before arrival. Later cancellations may incur the first night’s charge.', tags: ['cancel', 'cancellation', 'policy'], sourceLabel: 'Cancellation policy' },
  { category: 'property', key: 'location', questionVariants: ['address', 'located', 'location'], answer: 'The fictional Harborlight Hotel is located at 18 Marina Walk, close to the waterfront district.', tags: ['address', 'location'], sourceLabel: 'Property information' }
];
export const demoRooms = [
  { code: 'harbor-king', name: 'Harbor King Room', capacity: 2, beds: '1 king bed', accessible: true, rate: 189 },
  { code: 'family-suite', name: 'Family Harbor Suite', capacity: 4, beds: '1 king bed and 1 sofa bed', accessible: true, rate: 279 },
  { code: 'twin-deluxe', name: 'Deluxe Twin Room', capacity: 3, beds: '2 twin beds and 1 rollaway', accessible: false, rate: 229 }
];
export const demoInventory = { '2026-10-10:2026-10-12': ['family-suite', 'twin-deluxe'], '2026-12-24:2026-12-27': [] };
