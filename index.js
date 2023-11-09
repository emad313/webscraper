const express = require('express');
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();
const port = 5000;


async function webScraper() {
    const url = "https://www.nytimes.com/";
    const result = [];
    await axios(url).then((response) => {
      const html_data = response.data;
      const $ = cheerio.load(html_data);
      const selectedElem = ".story-wrapper"
        $(selectedElem).each((i, element) => {
            const title = $(element).find("h3").text();
            const link = $(element).find("a").attr("href");
            const summary = $(element).find("p").text();
            result.push({
            title: title,
            link: link,
            summary: summary,
            });
        });
    });
    return result;
  }

app.get('/scrape', async  (req, res) => {
    try {
        const data = await webScraper();
        return res.status(200).json({
          result: data,
        });
      } catch (err) {
        return res.status(500).json({
          err: err.toString(),
        });
      }
}
);

app.get('/', (req, res) => {
  res.send('Basic Web Scraper API - /scrape');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})