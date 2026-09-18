import mongoose from 'mongoose';
import { config, demoFacts, demoRooms, demoInventory } from '../src/config/config.js';
import { HotelFact, Room, Inventory } from '../src/models/index.js';
if (!config.mongoUri) { console.log('MONGODB_URI is not configured; demo fallback data is already available.'); process.exit(0); }
await mongoose.connect(config.mongoUri); await Promise.all([HotelFact.deleteMany({}), Room.deleteMany({}), Inventory.deleteMany({})]); await HotelFact.insertMany(demoFacts); await Room.insertMany(demoRooms); await Inventory.insertMany(Object.entries(demoInventory).map(([range, availableCodes]) => { const [checkIn, checkOut] = range.split(':'); return { checkIn, checkOut, availableCodes }; })); console.log('Seeded hotel facts, rooms, and inventory.'); await mongoose.disconnect();
