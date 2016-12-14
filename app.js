'use strict';

const url =  require('url');
const debug = require('debug')('app');
const async = require('async');

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
            
            // if url is not functioning
            if(err) {                
                return cb(err);
            }

            _arr.push({
                link: _url,
                title: 'Home Page',
                depth: 0,
                statusCode: statusCode  
            });
            
            //if no links are found on the home page
            if(links === null){
                return cb(null);
            }
            debug('Home Page Crawl Successful, with total links: ',links.length);
            // inserting the crawled links to the global array list
            helper.copyLinks(_arr,links);

            // running 5 instances concurrently of the async crawlFromList function.
            const instances =[];
            for(let i=1; i<=global.instances;i++){
                instances.push(function(callback){                    
                    debug('Crawl Instance '+ i +' Started')
                    obj.crawlFromList(callback,j);
                });
            }            
            async.parallel(instances,function(err,results){
                if(err){
                    return cb(err);        
                }
                return cb(null);
            });              
        
        });
    }
}


function main(){

    console.log('Webpage to be crawled:',global.url);
    console.log('depth of crawl:',global.getDepth());
    console.log('concurrent crawler instances:',global.instances);
    console.log('****** Started ********');
           
    getLinks((err)=>{

        if(err){
            console.log('Error on request to URL',err);
            process.exit(1);
        }else{
            debug('Total links: ',_arr.length);
            helper.save2csv(_arr,global.filepath);
        }
    });    
}

module.exports = exports = main;