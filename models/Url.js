// models/Url.js
const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  customAlias: { type: String, unique: true, sparse: true },
}, { timestamps: true });

// indexes for uniqueness
UrlSchema.index({ shortId: 1 }, { unique: true });
UrlSchema.index({ customAlias: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Url', UrlSchema);
