import { demoFacts, demoRooms, demoInventory } from '../config/config.js';
import { HotelFact, Room, Inventory } from '../models/index.js';
export async function findFacts(question) {
  if (HotelFact.db.readyState === 1) { const terms = question.toLowerCase().split(/\\s+/).filter(x => x.length > 2); return HotelFact.find({ $or: [{ tags: { $in: terms } }, { questionVariants: { $in: terms } }] }).limit(5).lean(); }
  const q = question.toLowerCase(); return demoFacts.filter(f => [...f.tags, ...f.questionVariants].some(t => q.includes(t))).slice(0, 5);
}
export async function findRoomsForGuests(adults) {
  if (Room.db.readyState === 1) return Room.find({ capacity: { $gte: adults } }).sort({ capacity: 1 }).lean();
  return demoRooms.filter(r => r.capacity >= adults).sort((a, b) => a.capacity - b.capacity);
}
export async function checkAvailability({ checkIn, checkOut, adults }) {
  const rooms = await findRoomsForGuests(adults);
  let inventory = demoInventory[`${checkIn}:${checkOut}`];
  if (Inventory.db.readyState === 1) { const row = await Inventory.findOne({ checkIn, checkOut }).lean(); if (row) inventory = row.availableCodes; }
  if (!inventory) return rooms.map(r => ({ ...r, availableCount: r.totalRooms || Math.floor(Math.random() * 6) + 2 }));
  return rooms.filter(r => inventory[r.code] > 0).map(r => ({ ...r, availableCount: inventory[r.code] }));
}
