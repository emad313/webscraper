const puppeteer = require('puppeteer');
const fs = require('fs');


// Web Scraper Function - Takes in a URL and returns the HTML of the page as a string
async function webScraper(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // const url = "https://www.nytimes.com/";
  await page.goto(url, {waitUntil: 'domcontentloaded'});

  const aHandle = await page.evaluateHandle(() => document.body);
const resultHandle = await page.evaluateHandle(
  body => body.innerHTML,
  aHandle
);

var html = await resultHandle.jsonValue();
await resultHandle.dispose();

  await browser.close();
  return html;
}

// webScraper('https://www.nytimes.com/').then((value) => {
//     console.log(value); // Success!
//     }
//     ).catch((err) => {
//     console.log(err); // Error!
//     });

// Taking a Screenshot of a Page - Takes in a URL and returns a screenshot of the page

async function screenshot(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 720 });

  await page.goto(url, { waitUntil: 'networkidle0' });

  // if not derectory, create directory named screenshot
  const dir = './screenshot';
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  await page.screenshot({
    path: 'screenshot/'+'screenshot-'+Date.now()+'.png',
  });

  await browser.close();
  return 'Screenshot Taken';
}

// screenshot('https://www.nytimes.com/').then((value) => {
//     console.log(value); // Success!
//     }
//     ).catch((err) => {
//     console.log(err); // Error!
//     });

// Saving a PDF of a Page - Takes in a URL and returns a PDF of the page

async function pdf(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' }); 

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    // if not derectory, create directory named pdf
    const dir = './pdf';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    // Download the PDF
    const pdf = await page.pdf({
      path: 'pdf/'+'pdf-'+Date.now()+'.pdf',
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });

  await browser.close();
  return 'PDF Taken';
}

// pdf('https://www.nytimes.com/').then((value) => {
//     console.log(value); // Success!
//     }).catch((err) => {
//     console.log(err); // Error!
//     });

// Downloading a image - Takes in a URL and returns a file download

async function downloadImages(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let counter = 0;
  page.on('response', async (response) => {
    const matches = /.*\.(jpg|png|svg|gif)$/i.exec(response.url());
    if (matches && (matches.length === 2)) {
      const extension = matches[1];
      const buffer = await response.buffer();
      const dir = './images';
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      fs.writeFileSync(`images/image-${counter}.${extension}`, buffer, 'base64');
      counter += 1;
    }
  });

  await page.goto(url);
  await browser.close();
  return 'Images Downloaded';
}

// downloadImages('https://www.nytimes.com/').then((value) => {
//     console.log(value); // Success!
//     }).catch((err) => {
//     console.log(err); // Error!
//     });

// All functions exported as an object to be used in other files
    var scraper = {
        webScraper: webScraper,
        screenshot: screenshot,
        pdf: pdf,
        downloadImages: downloadImages
    }

    module.exports = scraper;