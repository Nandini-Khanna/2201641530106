const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const Url = require('./models/url');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(logger);

app.use('/api/shorturls', urlRoutes);

// Redirection logic
app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;

    try {
        const url = await Url.findOne({ shortCode });
        if (!url || new Date() > url.expiry) {
            return res.status(404).json({ message: 'Short URL expired or does not exist.' });
        }

        url.clicks++;
        url.clickData.push({
            timestamp: new Date(),
            referrer: req.get('Referrer') || 'Direct',
            geo: 'Unknown'
        });
        await url.save();

        res.redirect(url.longUrl);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
