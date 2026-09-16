const mongoose = require('mongoose');
const dns = require('dns');

// Fix DNS SRV lookup issues on Windows / Node 18+ by using Google & Cloudflare DNS
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if unsupported
}

let isConnected = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chefmate_ai';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    isConnected = true;
    console.log(`[ChefMate AI] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[ChefMate AI] MongoDB Connection Warning: ${error.message}`);
    console.warn(`[ChefMate AI] Operating with memory store fallback for guest interactions if database unavailable.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
