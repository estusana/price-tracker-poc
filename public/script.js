document.addEventListener('DOMContentLoaded', function () {
    const trackBtn = document.getElementById('trackBtn');
    const productUrl = document.getElementById('productUrl');
    const result = document.getElementById('result');

    trackBtn.addEventListener('click', function () {
        const url = productUrl.value.trim();

        if (!url) {
            result.innerHTML = '<p style="color: red;">Please enter a product URL</p>';
            return;
        }

        result.innerHTML = '<p>Tracking functionality coming soon...</p>';
    });
});