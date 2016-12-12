'use strict';

const https = require('https');
const http = require('http');
const url =  require('url');


//http request wrapper
//error one has to be included
function request(_url,callback){
    
    if(url.parse(_url).protocol === 'https:'){
        https.get(_url,(response)=>{
            let body = '';
            response.on('data',(d)=>{
                body+=d;
            });
            response.on('end',()=>{
                callback(null,response,body);             
            });
        }).on('error',(err)=>{
            callback(err);
        });
    }else if(url.parse(_url).protocol === 'http:'){
        http.get(_url,(response)=>{
            let body = '';
            response.on('data',(d)=>{
                body+=d;
            });
            response.on('end',()=>{
                callback(null,response,body);             
            });
        }).on('error',(err)=>{
            callback(err);
        });
    }
    
}

module.exports = exports = request;