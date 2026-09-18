import { app } from './app.js';
import { config } from './config/config.js';
import { connectMongo, disconnectMongo } from './db/mongo.js';
await connectMongo();
const server = app.listen(config.port, '0.0.0.0', () => console.log(`Hotel assistant API listening on ${config.port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await disconnectMongo(); server.close(() => process.exit(0)); });
