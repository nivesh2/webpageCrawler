'use strict';

const url = require('url');
//used to parse the HTML body to scrap the contents
const cheerio = require('cheerio');
const debug = require('debug')('crawl');
const debug2 = require('debug')('crawl:instance');

//custom files
const request = require('./helper/http_request');
const copyLinks = require('./helper/helperfunctions').copyLinks;
const global = require('./global');

let _index=0;

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
            debug('Error on request to URL: ',err);
            if(response == null){
                // console.log('Error on request to URL',err);
                return callback(err,null,null);
            }                
            else{
                return callback(err,null,response.statusCode);
            } 
                        
        }else {
            /*             
             * crawl links only to specified depth and domain
             * for rest only check whether the link is broken or not 
             */
            let alinks = null;
            
            if(response.statusCode === 200 && body!=null){
                if(options.depth_count<global.getDepth() && options.regex.test(options.hostname)){                
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

function crawlFromList(cb,j){
    let temp = _arr[_index++];
    
    //check if list is exhausted    
    if(temp != null){                
        const options = {
            url:temp.link,
            depth_count:temp.depth,
            hostname:url.parse(temp.link).hostname,
            regex: /medium.com$/g            
        } 
        if(url.parse(temp.link).protocol == null){
            //is link is like: //facebook.com/WorldPressPhoto or //medium.com/policy/9db0094a1e0f
            // which is not a proper url
            debug('Erro Link:',temp.link);
            return crawlFromList(cb,j);
        }
        crawlUrl(options,function(err,alinks,statusCode){            
            temp.statusCode=statusCode;
            debug('Instance: '+j+ ' | %o',temp);       
            if(err){
                //already handled
            }else if(statusCode === 200 && alinks != null){
                copyLinks(_arr,alinks);                        
            }
            //recursive call
            return crawlFromList(cb,j);
        });
    }else{
        debug2('Instance exited: '+j);
        return cb(null,false);
    }        
}

