'use strict';
const debug = require('debug')('helper');
const json2csv = require('json2csv');
// obj is used as hashset to only store unique keys. 
const obj = {};
/*
 * copying only unique links
 * does not copy duplicate links
 */
function copyLinks(a,links){    
    for(let i=0;i<links.length;i++){
        if(obj[links[i].link]==null){
            a.push(links[i]);
            obj[links[i].link]=0;
        }else{
            debug('duplicate links:',links[i].link);
        }
    }
}

function save2csv(_arr,filepath){
    //creating csv using json2csv
    var csv = json2csv({
        data:_arr,
        fields:['link','title','depth','statusCode']
    });
    
    require('fs').writeFile(filepath,csv,(err)=>{
        if(err){
            debug('Error while saving file');
            console.log(err);
            process.exit(0);                    
        }else{
            debug('CSV File Created');
            console.log('Process END')
            process.exit(0);
        }
        
    });
}
module.exports = exports = {
    copyLinks : copyLinks,
    save2csv: save2csv    
}; 