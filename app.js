'use strict';

const url =  require('url');
const debug = require('debug')('app');

const global = require('./global');
const obj = require('./crawl_url');
const helper = require('./helper/helperfunctions');


let _arr=global.arr;
let _url = global.url;

//crawl to the specified depth and returns a list of all the crawled URL.
function getLinks(cb){
    
    if(_arr.length === 0){
        const options = {
            url:_url,
            depth_count:0,
            hostname:url.parse(_url).hostname,
            regex: /medium.com$/g            
        }; 

        //first hit to url
        obj.crawlUrl(options,(err,links,statusCode)=>{
            
            _arr.push({
                link: _url,
                title: 'Home Page',
                depth: 0,
                statusCode: statusCode  
            });
            
            // if url is not functioning
            if(err) {                
                return cb(err);
            }
            //if no links are found on the home page
            if(links === null){
                return cb(null,true);
            }
            // inserting the crawled links to the global array list
            helper.copyLinks(_arr,links);

            // running 5 instances concurrently of the crawlFromList function.
            for(var i=0;i<global.instances;i++){
                obj.crawlFromList(cb);
            }                
        
        });
    }
}


function main(){

    console.log('Webpage to be crawled:',global.url);
    console.log('depth of crawl:',global.getDepth());
    console.log('concurrent crawler instances:',global.instances);
    console.log('****** Started ********');
        
    var count=0;    
    getLinks((err,nolinks)=>{

        if(err){
            console.log('Error on request to URL',err);
            process.exit(1);
        }else{
            count+=1;
            debug('Instances exited: ',count);
            if(count === 5 || nolinks === true){                
                // saves to csv only when all the 5 crawl process instances are over or
                // there is no link to crawl at the home page. 
                debug('Total links: ',_arr.length);
                helper.save2csv(_arr,global.filepath);
            }
        }
    });    
}

module.exports = exports = main;