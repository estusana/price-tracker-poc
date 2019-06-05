const axios = require('axios');
const cheerio = require('cheerio');

class PriceScraper {
    constructor() {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    }

    async scrapePrice(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': this.userAgent
                },
                timeout: 10000
            });

            const $ = cheerio.load(response.data);

            // Basic price selectors for common e-commerce sites
            const priceSelectors = [
                '.price',
                '.price-current',
                '[data-price]',
                '.product-price',
                '.sale-price'
            ];

            let price = null;
            let productName = null;

            // Try to find price
            for (const selector of priceSelectors) {
                const element = $(selector).first();
                if (element.length) {
                    price = this.extractPrice(element.text());
                    if (price) break;
                }
            }

            // Try to find product name
            productName = $('h1').first().text().trim() ||
                $('.product-title').first().text().trim() ||
                $('.product-name').first().text().trim() ||
                $('title').text().trim();

            return {
                success: true,
                price,
                productName,
                currency: 'USD', // Default for now
                timestamp: new Date().toISOString(),
                url
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                url
            };
        }
    }

    extractPrice(text) {
        // Remove whitespace and extract price
        const cleaned = text.replace(/\s+/g, ' ').trim();
        const priceMatch = cleaned.match(/[\$£€]?(\d+(?:,\d{3})*(?:\.\d{2})?)/);

        if (priceMatch) {
            return parseFloat(priceMatch[1].replace(/,/g, ''));
        }

        return null;
    }
}

module.exports = PriceScraper;