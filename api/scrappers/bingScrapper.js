const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function scrapeBing(searchQuery, depth) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const [page] = await browser.pages();
    await page.setRequestInterception(true);
    // page.on("request", (request) => {
    //   request.resourceType() === "document" ||
    //   request.resourceType() === "script" || request.resourceType() === "xhr"
    //     ? request.continue()
    //     : request.abort();
    // });
    page.on("request", (request) => {
      request.continue();
      });

    await page.goto(`https://www.bing.com/search?q=${searchQuery}`, {
      waitUntil: "domcontentloaded",
    });

    const results = [];

    await page.waitForSelector("ol#b_results");
    for (let i = 0; i < depth; i++) {
      // Wait for the search results to load
      await page.waitForSelector("ol#b_results");
      

      // Extract the search results on this page
      const pageResults = await page.evaluate(async() => {
        const searchResults = [];
        const resultsElements = document.querySelectorAll("#b_results .b_algo");

        resultsElements.forEach((element) => {
          const titleElement = element.querySelector("h2  a");
          const linkElement = element.querySelector("h2 a");
          const descElement = element.querySelector("div.b_caption  p");
          const imgElement = element.querySelector("img.rms_img");
          //the div with all these elements will be the required div
          if (titleElement && linkElement && descElement) {
            searchResults.push({
              title: titleElement.textContent.trim(),
              link: linkElement.href,
              desc: descElement.textContent.trim(),
              img: imgElement
                ? imgElement.src
                : "https://cdn-icons-png.flaticon.com/512/888/888844.png",
            });
          }
        });
        console.log(searchResults);
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

module.exports = scrapeBing;
