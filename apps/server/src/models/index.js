import mongoose from 'mongoose';
const factSchema = new mongoose.Schema({ category: String, key: { type: String, unique: true }, questionVariants: [String], answer: String, tags: [String], sourceLabel: String });
const roomSchema = new mongoose.Schema({ code: { type: String, unique: true }, name: String, capacity: Number, beds: String, accessible: Boolean, rate: Number });
const inventorySchema = new mongoose.Schema({ checkIn: String, checkOut: String, availableCodes: [String] });
export const HotelFact = mongoose.model('HotelFact', factSchema);
export const Room = mongoose.model('Room', roomSchema);
export const Inventory = mongoose.model('Inventory', inventorySchema);
