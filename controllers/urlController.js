const Url = require('../models/url');
const generateShortCode = require('../utils/shortcodeGen');

exports.createShortUrl = async (req, res) => {
    const { url, validity, shortcode } = req.body;

    if (!url) return res.status(400).json({ message: 'URL is required.' });

    try {
        const existing = await Url.findOne({ longUrl: url });
        if (existing) return res.status(200).json(existing);

        const shortCode = shortcode || generateShortCode();
        const expiry = new Date(Date.now() + (validity || 30) * 60000);

        const newUrl = new Url({
            longUrl: url,
            shortCode,
            expiry
        });

        await newUrl.save();

        res.status(201).json({
            shortLink: `${process.env.BASE_URL}/${newUrl.shortCode}`,
            expiry: newUrl.expiry
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUrlStats = async (req, res) => {
    const { shortCode } = req.params;

    try {
        const url = await Url.findOne({ shortCode });
        if (!url) return res.status(404).json({ message: 'Short URL not found.' });

        res.json({
            longUrl: url.longUrl,
            createdAt: url.createdAt,
            expiry: url.expiry,
            clicks: url.clicks,
            clickData: url.clickData
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
