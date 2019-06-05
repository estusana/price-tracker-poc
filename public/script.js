document.addEventListener('DOMContentLoaded', function () {
    const trackBtn = document.getElementById('trackBtn');
    const productUrl = document.getElementById('productUrl');
    const result = document.getElementById('result');

    trackBtn.addEventListener('click', async function () {
        const url = productUrl.value.trim();

        if (!url) {
            result.innerHTML = '<p style="color: red;">Please enter a product URL</p>';
            return;
        }

        // Show loading state
        trackBtn.disabled = true;
        trackBtn.textContent = 'Scraping...';
        result.innerHTML = '<p>Fetching price data...</p>';

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (data.success && data.price) {
                result.innerHTML = `
                    <div style="background: #d4edda; padding: 15px; border-radius: 4px; border: 1px solid #c3e6cb;">
                        <h3 style="margin: 0 0 10px 0; color: #155724;">Price Found!</h3>
                        <p><strong>Product:</strong> ${data.productName || 'Unknown'}</p>
                        <p><strong>Price:</strong> $${data.price}</p>
                        <p><strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                    </div>
                `;
            } else {
                result.innerHTML = `
                    <div style="background: #f8d7da; padding: 15px; border-radius: 4px; border: 1px solid #f5c6cb;">
                        <h3 style="margin: 0 0 10px 0; color: #721c24;">Scraping Failed</h3>
                        <p>Could not extract price from this URL. Please try a different product page.</p>
                        ${data.error ? `<p><small>Error: ${data.error}</small></p>` : ''}
                    </div>
                `;
            }
        } catch (error) {
            result.innerHTML = `
                <div style="background: #f8d7da; padding: 15px; border-radius: 4px; border: 1px solid #f5c6cb;">
                    <h3 style="margin: 0 0 10px 0; color: #721c24;">Network Error</h3>
                    <p>Failed to connect to the server. Please try again.</p>
                </div>
            `;
        } finally {
            trackBtn.disabled = false;
            trackBtn.textContent = 'Track Price';
        }
    });
});