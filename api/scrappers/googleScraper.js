const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function scrapeGoogle(searchQuery, depth) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const [page] = await browser.pages();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      request.resourceType() === "document"
        ? request.continue()
        : request.abort();
    });
    await delay(1500);
    await page.goto(`https://www.google.com/search?q=${searchQuery}&num=10`, {
      waitUntil: "domcontentloaded",
    });
    const results = [];
    await page.waitForSelector("div#search");
    for (let i = 0; i < depth; i++) {
      // Wait for the search results to load
      await page.waitForSelector("div#search");
      // Extract the search results on this page
      const pageResults = await page.evaluate(() => {
        const searchResults = [];
        const resultsElements = document.querySelectorAll("div.g");

        resultsElements.forEach((element) => {
          const titleElement = element.querySelector("h3");
          const linkElement = element.querySelector("a");
          const descElement = element.querySelector(".VwiC3b");
          const imgElement = element.querySelector("img");
          //the div with all these elements will be the required div
          if (titleElement && linkElement && descElement) {
            searchResults.push({
              title: titleElement.innerText,
              link: linkElement.href,
              desc: descElement.innerText,
              img: imgElement ? imgElement.src : "",
            });
          }
        });

        return searchResults;
      });
      results.push(...pageResults);
      const nextButton = await page.$("#pnnext");
      nextButton ? await nextButton.click() : null;
    }
    // console.log(results);
    return results;
  } catch (err) {
    console.log(err);
    return err;
  } finally {
    browser.close();
  }
}

module.exports = scrapeGoogle;
