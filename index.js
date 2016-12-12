'use strict';
const debug = require('debug')('app');
const global = require('./global');

//this flag is used so that depth is setted only once for 1 execution of program
let depthSetted = false;

console.log('Enter crawl depth:');

process.stdin.resume();
process.stdin.setEncoding("utf-8");
process.stdin.on("data", function (input) {
   
   let depth = parseInt(input.slice(0,input.length-1),10);
   
   if(isNaN(depth)){
       console.log('Depth should be of number type');
       console.log('ReEnter crawl depth:');
       
   }else if(!depthSetted){
       depthSetted = true;

       global.setDepth(input);
       debug('Depth Setted');

       debug('Main Called');
       require('./app')();
   }
});