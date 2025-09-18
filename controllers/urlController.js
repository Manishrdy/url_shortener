// controllers/urlController.js
const asyncHandler = require('express-async-handler');
const { customAlphabet } = require('nanoid');
const Url = require('../models/Url');

console.log('controllers/urlController loaded. Url type:', typeof Url);
if (!Url || typeof Url.findOne !== 'function') {
    console.error('ERROR: Url model does not expose findOne(). Please check models/Url.js and that modules are not swapped.');
}

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

const normalizeUrl = (url) => {
    if (!url) return url;
    if (!/^https?:\/\//i.test(url)) {
        return 'http://' + url;
    }
    return url;
};

const createUrl = asyncHandler(async (req, res) => {
    if (!Url || typeof Url.findOne !== 'function') {
        res.status(500);
        throw new Error('Url model not available on server. Check server logs.');
    }

    const { originalUrl, customAlias } = req.body;
    if (!originalUrl || typeof originalUrl !== 'string') {
        res.status(400);
        throw new Error('originalUrl is required');
    }

    const normalized = normalizeUrl(originalUrl.trim());

    if (customAlias) {
        const existsAlias = await Url.findOne({ customAlias: customAlias.trim() });
        if (existsAlias) {
            res.status(400);
            throw new Error('customAlias already in use');
        }
    }

    let shortId;
    let attempt = 0;
    const maxAttempts = 5;
    do {
        shortId = nanoid();
        const exists = await Url.findOne({ shortId });
        if (!exists) break;
        attempt++;
    } while (attempt < maxAttempts);

    if (!shortId) {
        res.status(500);
        throw new Error('Failed to generate unique shortId');
    }

    const urlDoc = await Url.create({
        user: req.user._id,
        originalUrl: normalized,
        shortId,
        customAlias: customAlias ? customAlias.trim() : undefined,
    });

    const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const shortPath = urlDoc.customAlias || urlDoc.shortId;
    const shortUrl = `${base.replace(/\/$/, '')}/${shortPath}`;

    res.status(201).json({
        id: urlDoc._id,
        originalUrl: urlDoc.originalUrl,
        shortId: urlDoc.shortId,
        customAlias: urlDoc.customAlias || null,
        shortUrl,
        createdAt: urlDoc.createdAt,
    });
});

module.exports = { createUrl };
