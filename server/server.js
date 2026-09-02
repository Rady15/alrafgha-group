const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Load .env only if present (Railway injects env vars directly)
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config();
}

const app = require('./app');
const seedProduction = require('./seedProduction');

// Validate / set critical env vars
if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET environment variable is not set.');
    console.error('❌ Refusing to start: JWT_SECRET is REQUIRED in production so that tokens remain');
    console.error('❌ valid across restarts. Set JWT_SECRET in your environment variables.');
    process.exit(1);
}
if (!process.env.JWT_EXPIRES_IN) process.env.JWT_EXPIRES_IN = '90d';
if (!process.env.JWT_COOKIE_EXPIRES_IN) process.env.JWT_COOKIE_EXPIRES_IN = '90';

let DB = (process.env.DATABASE || '').replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD || ''
);

if (!DB) {
    console.error('❌ DATABASE environment variable is not set.');
    process.exit(1);
}

const port = process.env.PORT || 5600;

mongoose
    .connect(DB)
    .then(async () => {
        console.log('✅ MongoDB connection successful!');
        // Auto-seed on first boot if DB is empty
        if (process.env.SEED_ON_START !== 'false') {
            await seedProduction();
        }
        const server = app.listen(port, () => {
            console.log(`🎉 Alrafgha Group server is running on http://localhost:${port}`);
        });

        process.on('unhandledRejection', err => {
            console.log('UNHANDLED REJECTION! 💥 Shutting down...');
            console.log(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });