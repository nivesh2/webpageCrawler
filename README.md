#Webpage crawler Using Node.JS

Entry point is `app.js` and `global.js` is more like a configuraitons file for the crawler.

## Third party libraries used:
 - cheerio: used to parse the THTML content to scrap the links,
 - json2csv: used to convert file JSON array to CSV
 - debug: for better logging while debugging.

## SetUp Steps
 - clone the repo
 - change `global.js` as per your requirement.
 - run below commands

## commands
 - to start: `npm start` 
 - for debugging:
    * Install Debug module globally: `npm install debug -g`
    * `DEBUG='main:*' node app.js`