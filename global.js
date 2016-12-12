'use strict';

/*
 * depth: defines the depth of the crawler
 * arr: is the global array list which contains the list of all the links
 * url: link to be crawled
 * filepath: path and name of the csv file to be created
 * instances: number of concurrent processes to be created to crawl the url
 */
module.exports = exports = {
    depth: 2,
    arr: [],
    url: 'https://medium.com',
    filepath: './output/medium.csv',
    instances:5
};