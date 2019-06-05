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

            // Comprehensive price selectors for real e-commerce sites
            const priceSelectors = [
                // Generic price classes
                '.price', '.price-current', '.current-price', '.sale-price',
                '.product-price', '.price-now', '.price-value', '.final-price',

                // Common e-commerce patterns
                '[data-price]', '[data-testid*="price"]', '[class*="price"]',
                '.price-box .price', '.price-container .price',

                // Specific patterns found on real sites
                '.price-display', '.price-text', '.currency',
                '.cost', '.amount', '.value',

                // Fallback patterns
                'span[class*="price"]', 'div[class*="price"]',
                'span[id*="price"]', 'div[id*="price"]'
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
        // Remove whitespace and clean text
        const cleaned = text.replace(/\s+/g, ' ').trim();

        // Multiple price patterns for different formats
        const patterns = [
            // Standard formats: $29.99, £45.00, €19.95
            /[\$£€¥₹](\d+(?:,\d{3})*(?:\.\d{2})?)/,
            // Formats without currency symbol: 29.99, 45.00
            /(\d+(?:,\d{3})*\.\d{2})/,
            // Integer prices: $29, £45
            /[\$£€¥₹](\d+(?:,\d{3})*)/,
            // Price with text: "Price: $29.99", "Cost $45"
            /(?:price|cost|amount)[\s:]*[\$£€¥₹]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
            // Just numbers (last resort): 2999, 4500
            /(\d{2,})/
        ];

        for (const pattern of patterns) {
            const match = cleaned.match(pattern);
            if (match) {
                let price = parseFloat(match[1].replace(/,/g, ''));

                // Handle cents-only prices (like 2999 = $29.99)
                if (price > 1000 && !cleaned.includes('.')) {
                    price = price / 100;
                }

                return price;
            }
        }

        return null;
    }
}

module.exports = PriceScraper;