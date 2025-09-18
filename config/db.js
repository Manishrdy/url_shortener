// config/db.js
const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://localhost:27017/urlshortener';

const connectWithRetry = async (uri, attempts = 0) => {
    const maxAttempts = 5;
    const retryDelayMs = Math.min(30000, 1000 * Math.pow(2, attempts)); // exponential backoff, cap 30s

    try {
        await mongoose.connect(uri, {
            // Mongoose 6+ already sets sensible defaults. We keep some explicit flags for clarity.
            // These options are safe; mongoose will maintain sockets and auto-reconnect.
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            // keepAlive is handled by the driver; these explicit settings are optional
            // keepAlive: true,
            // keepAliveInitialDelay: 300000,
        });

        console.log('MongoDB connected');
    } catch (err) {
        console.error(`MongoDB connection error (attempt ${attempts + 1}):`, err.message || err);
        if (attempts < maxAttempts) {
            console.log(`Retrying in ${retryDelayMs}ms...`);
            await new Promise((res) => setTimeout(res, retryDelayMs));
            return connectWithRetry(uri, attempts + 1);
        } else {
            console.error('Max MongoDB connection attempts reached. Exiting.');
            process.exit(1);
        }
    }
};

const registerListeners = () => {
    mongoose.connection.on('connected', () => {
        console.log('Mongoose event: connected');
    });
    mongoose.connection.on('reconnected', () => {
        console.log('Mongoose event: reconnected');
    });
    mongoose.connection.on('disconnected', () => {
        console.warn('Mongoose event: disconnected');
    });
    mongoose.connection.on('close', () => {
        console.warn('Mongoose event: close');
    });
    mongoose.connection.on('error', (err) => {
        console.error('Mongoose event: error', err);
    });
};

const connectDB = async () => {
    const uri = process.env.MONGO_URI || DEFAULT_URI;
    registerListeners();
    await connectWithRetry(uri);
};

module.exports = connectDB;
