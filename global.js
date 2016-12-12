'use strict';

//depth is setted by User during program run
var _depth=0;

function setDepth(depth){
    _depth = depth;
}

function getDepth(){
    return _depth;
}

/*
 * depth: defines the depth of the crawler
 * arr: is the global array list which contains the list of all the links
 * url: link to be crawled
 * filepath: path and name of the csv file to be created
 * instances: number of concurrent processes to be created to crawl the url
 */

module.exports = exports = {
    getDepth: getDepth,
    setDepth:setDepth,
    arr: [],
    url: 'https://medium.com',
    filepath: './output/medium.csv',
    instances:5
};
