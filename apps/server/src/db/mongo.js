import mongoose from 'mongoose';
import { config } from '../config/config.js';
let connected = false;
export async function connectMongo() {
  if (!config.mongoUri) return false;
  try { await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 1500 }); connected = true; return true; }
  catch (error) { console.warn('MongoDB unavailable; using deterministic demo data:', error.message); return false; }
}
export function mongoReady() { return connected && mongoose.connection.readyState === 1; }
export async function disconnectMongo() { if (connected) await mongoose.disconnect(); }
