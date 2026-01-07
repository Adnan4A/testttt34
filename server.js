const puppeteer = require('puppeteer');

// Example 1: Scrape Quotes from quotes.toscrape.com
async function scrapeQuotes() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://quotes.toscrape.com/', { waitUntil: 'networkidle2' });

  const quotes = await page.evaluate(() => {
    const quoteElements = document.querySelectorAll('.quote');
    return Array.from(quoteElements).map(quote => ({
      text: quote.querySelector('.text').innerText,
      author: quote.querySelector('.author').innerText,
      tags: Array.from(quote.querySelectorAll('.tag')).map(tag => tag.innerText)
    }));
  });

  console.log('Scraped Quotes:', quotes);
  await browser.close();
  return quotes;
}

// Example 2: Scrape Books from books.toscrape.com
async function scrapeBooks() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://books.toscrape.com/', { waitUntil: 'networkidle2' });

  const books = await page.evaluate(() => {
    const bookElements = document.querySelectorAll('.product_pod');
    return Array.from(bookElements).map(book => ({
      title: book.querySelector('h3 a').getAttribute('title'),
      price: book.querySelector('.price_color').innerText,
      availability: book.querySelector('.availability').innerText.trim(),
      rating: book.querySelector('.star-rating').className.split(' ')[1]
    }));
  });

  console.log('Scraped Books:', books);
  await browser.close();
  return books;
}

// Example 3: Scrape with Screenshot
async function scrapeWithScreenshot(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Take screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  // Get page title
  const title = await page.title();
  console.log('Page Title:', title);

  await browser.close();
  return { title };
}

// Example 4: Scrape with Pagination
async function scrapePaginated() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  let allQuotes = [];
  let pageNumber = 1;
  const maxPages = 3; // Limit to 3 pages for demo

  while (pageNumber <= maxPages) {
    await page.goto(`https://quotes.toscrape.com/page/${pageNumber}/`, { 
      waitUntil: 'networkidle2' 
    });

    const quotes = await page.evaluate(() => {
      const quoteElements = document.querySelectorAll('.quote');
      return Array.from(quoteElements).map(quote => ({
        text: quote.querySelector('.text').innerText,
        author: quote.querySelector('.author').innerText
      }));
    });

    allQuotes = allQuotes.concat(quotes);
    console.log(`Scraped page ${pageNumber}, got ${quotes.length} quotes`);

    // Check if next page exists
    const nextButton = await page.$('.next');
    if (!nextButton || pageNumber >= maxPages) break;
    
    pageNumber++;
  }

  console.log(`Total quotes scraped: ${allQuotes.length}`);
  await browser.close();
  return allQuotes;
}

// Example 5: Scrape with Wait for Selector (for dynamic content)
async function scrapeDynamic() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://quotes.toscrape.com/js/', { waitUntil: 'networkidle2' });

  // Wait for content loaded by JavaScript
  await page.waitForSelector('.quote', { timeout: 5000 });

  const quotes = await page.evaluate(() => {
    const quoteElements = document.querySelectorAll('.quote');
    return Array.from(quoteElements).map(quote => ({
      text: quote.querySelector('.text').innerText,
      author: quote.querySelector('.author').innerText
    }));
  });

  console.log('Scraped Dynamic Content:', quotes);
  await browser.close();
  return quotes;
}

// Main execution
(async () => {
  try {
    console.log('=== Example 1: Scraping Quotes ===');
    await scrapeQuotes();

    console.log('\n=== Example 2: Scraping Books ===');
    await scrapeBooks();

    console.log('\n=== Example 4: Paginated Scraping ===');
    await scrapePaginated();

    console.log('\n=== Example 5: Dynamic Content ===');
    await scrapeDynamic();

  } catch (error) {
    console.error('Error during scraping:', error);
  }
})();

// Export functions for use in other files
module.exports = {
  scrapeQuotes,
  scrapeBooks,
  scrapeWithScreenshot,
  scrapePaginated,
  scrapeDynamic
};
