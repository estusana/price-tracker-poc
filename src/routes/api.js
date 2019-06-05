const express = require('express');
const PriceScraper = require('../scraper');

const router = express.Router();
const scraper = new PriceScraper();

// POST /api/scrape - Scrape price from URL
router.post('/scrape', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: 'URL is required'
        });
    }

    try {
        const result = await scraper.scrapePrice(url);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Scraping failed',
            error: error.message
        });
    }
});

module.exports = router;