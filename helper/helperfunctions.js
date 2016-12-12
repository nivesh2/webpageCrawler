'use strict';
const debug = require('debug')('helperfunctions');
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

module.exports = exports = {
    copyLinks :copyLinks    
}; 