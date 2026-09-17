'use strict';
const AI=require('@kobalab/majiang-ai');
const player=new AI();
self.onmessage=({data})=>{try{player.action(data.message,data.reply?result=>self.postMessage({id:data.id,result:result||{}}):undefined)}catch(error){self.postMessage({id:data.id,error:error.message})}};
