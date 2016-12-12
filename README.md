#Webpage crawler Using Node.JS

Entry point is `app.js` and `global.js` is more like a configuraitons file for the crawler.

### constarints:
 - this will crawl only anchor tag links, not that of image href or `<from>` tag actions links
 - this will crawl only url with hostname = medium.com or its subdomain,
 - this will not crawl duplicate links

### Third party libraries used:
 - cheerio: used to parse the THTML content to scrap the links,
 - json2csv: used to convert file JSON array to CSV
 - debug: for better logging while debugging.

### SetUp Steps
 - clone the repo
 - run `npm install`
 - change `global.js` as per your requirement.
 - run below commands

### commands
 - to start: `npm start` 
 - for debugging:
    * Install Debug module globally: `npm install debug -g`
    * `DEBUG=* node app.js`

> Note: Currently crawl depth is set to 2, you can change as per your requirement.
