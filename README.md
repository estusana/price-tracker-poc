# Price Tracker

A simple web scraper for tracking product prices from e-commerce websites.

**Note**: This is a toy project designed for learning and simple sites. It won't work on major commercial sites like Amazon, eBay, or Walmart due to anti-bot protection and dynamic content loading.

## Features

- Track single product price
- View price history
- Simple web interface
- Price visualization with charts

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open your browser and go to `http://localhost:3000`

## Usage

1. Enter a product URL from a simple e-commerce site
2. Click "Track Price" to start monitoring
3. View price history in the chart below

## What Works

- Small business websites with basic HTML structure
- Simple Shopify/WordPress stores
- Educational institution stores
- Test pages (try: `http://localhost:3000/test-product.html`)

## Tech Stack

- Node.js + Express
- Vanilla JavaScript
- Chart.js for visualization
- Cheerio for web scraping

## License

MIT
