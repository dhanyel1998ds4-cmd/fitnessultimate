const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  for (const viewport of [{ name: 'desktop', width: 988, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:43117', { waitUntil: 'networkidle' });
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      document.querySelector('.site-nav')?.setAttribute('hidden', '');
      document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
    });
    await page.waitForTimeout(500);
    await page.locator('#testimonials').screenshot({ path: `testimonial-${viewport.name}.png` });
    const metrics = await page.evaluate(() => {
      const rect = selector => {
        const r = document.querySelector(selector)?.getBoundingClientRect();
        return r && { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
      };
      return {
        section: rect('#testimonials'),
        heading: rect('#testimonials .section-heading'),
        stage: rect('.testimonial-stage'),
        card: rect('.testimonial-card.is-current'),
        copy: rect('.testimonial-card.is-current .testimonial-copy'),
        photo: rect('.testimonial-card.is-current .testimonial-photo'),
        controls: rect('.carousel-controls'),
        starCount: document.querySelectorAll('.testimonial-card.is-current .stars span').length,
        scrollWidth: document.documentElement.scrollWidth
      };
    });
    if (viewport.name === 'mobile') {
      await page.click('.testimonial-dots [data-slide="2"]');
      metrics.current = await page.locator('.testimonial-card.is-current h3').textContent();
    }
    results.push({ viewport: viewport.name, ...metrics, errors });
    await page.close();
  }
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
