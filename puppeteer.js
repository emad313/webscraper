const puppeteer = require('puppeteer');

async function webScraper() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = "https://www.nytimes.com/";
  await page.goto(url, {waitUntil: 'domcontentloaded'});

  const aHandle = await page.evaluateHandle(() => document.body);
const resultHandle = await page.evaluateHandle(
  body => body.innerHTML,
  aHandle
);

await resultHandle.jsonValue();
await resultHandle.dispose();

  await browser.close();
  return 0;
}

webScraper().then((value) => {
    console.log(value); // Success!
    }).catch((err) => {
    console.log(err); // Error!
    });