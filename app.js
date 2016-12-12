'use strict';

const url =  require('url');
const json2csv = require('json2csv');
const debug = require('debug')('app');

const global = require('./global');
const obj = require('./crawl_url');
const copyLinks = require('./helper/helperfunctions').copyLinks;


let _arr=global.arr;
let _url = global.url;

//crawl to the specified depth and returns a list of all the crawled URL.
function getLinks(cb){
    
    if(_arr.length === 0){
        var options = {
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
                return cb();
            }
            
            // inserting the crawled links to the global array list
            copyLinks(_arr,links);

            // running 5 instances concurrently of the crawlFromList function.
            for(var i=0;i<global.instances;i++){
                obj.crawlFromList(cb);
            }                
        
        });
    }
}


function main(){

    console.log('Webpage to be crawled:',global.url);
    console.log('depth of crawl:',global.depth);
    console.log('concurrent crawler instances:',global.instances);
    console.log('****** Started ********');
        
    var count=0;    
    getLinks(()=>{        
        count+=1;
        if(count === 5){
            
            debug('Total links: ',_arr.length);            

            //creating csv using json2csv
            var csv = json2csv({
                data:_arr,
                fields:['link','title','depth','statusCode']
            });
            
            require('fs').writeFile(global.filepath,csv,(err)=>{
                if(err) throw err;
                debug('CSV File Created');
            });            
        }        
    });    
}

//main called
main();