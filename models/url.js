const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    expiry: { type: Date, required: true },
    clicks: { type: Number, default: 0 },
    clickData: [
        {
            timestamp: { type: Date, default: Date.now },
            referrer: String,
            geo: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Url', UrlSchema);
