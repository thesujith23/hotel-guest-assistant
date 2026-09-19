import { demoFacts, demoRooms, demoInventory } from '../config/config.js';
export async function findFacts(question) { const q = question.toLowerCase(); return demoFacts.filter(f => [...f.tags, ...f.questionVariants].some(term => q.includes(term))).slice(0, 5); }
export async function findRoomsForGuests(adults) { return demoRooms.filter(room => room.capacity >= adults).sort((a, b) => a.capacity - b.capacity); }
export async function checkAvailability({ checkIn, checkOut, adults }) { const rooms = await findRoomsForGuests(adults); const range = demoInventory[`${checkIn}:${checkOut}`]; if (!range) return rooms.map(room => ({ ...room, availableCount: room.totalRooms })); return rooms.filter(room => range[room.code] > 0).map(room => ({ ...room, availableCount: range[room.code] })); }
