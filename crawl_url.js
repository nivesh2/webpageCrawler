'use strict';

const url = require('url');
//used to parse the HTML body to scrap the contents
const cheerio = require('cheerio');
const debug = require('debug')('crawl');

//custom files
const request = require('./helper/http_request');
const copyLinks = require('./helper/helperfunctions').copyLinks;
const global = require('./global');

let _index=0;
const _depth =global.depth;
let _arr=global.arr;

//exports
module.exports = exports = {
    crawlUrl:crawlUrl,
    crawlFromList:crawlFromList
}

//crawls the give url for links
function crawlUrl(options,callback){
    
    request(options.url,(err,response,body)=>{
        if(err) {
            debug('Error: ',err);
            callback(err,null,500);            
        }else {
            /*             
             * crawl links only to specified depth and domain
             * for rest only check whether the link is broken or not 
             */
            var alinks = null;
            if(response.statusCode === 200 && body!=null){
                if(options.depth_count<_depth && options.regex.test(options.hostname)){                
                    let $ = cheerio.load(body);
                    options.depth_count+=1;
                    alinks = $('a').map((i,e)=>{
                        return {
                            link: e.attribs.href,
                            title: e.attribs.title,
                            depth: options.depth_count  
                        }
                    }).get();
                }
            }                        
            callback(null,alinks,response.statusCode);
        }
    });    
}

function crawlFromList(cb){
    var temp = _arr[_index++];
    
    //check if list is exhausted    
    if(temp != null){                
        var options = {
            url:temp.link,
            depth_count:temp.depth,
            hostname:url.parse(temp.link).hostname,
            regex: /medium.com$/g            
        } 
        if(url.parse(temp.link).protocol == null){
            //is link is like: //facebook.com/WorldPressPhoto or //medium.com/policy/9db0094a1e0f
            // which is not a proper url
            debug('Erro Link:',temp.link);
            return crawlFromList(cb);
        }
        crawlUrl(options,function(err,alinks,statusCode){            
            temp.statusCode=statusCode;
            debug(temp);       
            if(err){
                //already handled
            }else if(statusCode === 200 && alinks != null){
                copyLinks(_arr,alinks);                        
            }
            //recursive call
            return crawlFromList(cb);
        });
    }else{
        debug('End Processing',_arr.length);
        return cb();
    }        
}

