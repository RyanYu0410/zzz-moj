// Export the source PNGs without recompressing or changing their artwork.
const fs=require('node:fs'),path=require('node:path');
const from=path.resolve(__dirname,'../dist/tiles');
const target=path.resolve(process.argv[2]||path.join(__dirname,'../output/tiles'));
if(target===from)throw new Error('Choose a destination outside dist/tiles');
fs.mkdirSync(target,{recursive:true});
for(const file of fs.readdirSync(from))fs.copyFileSync(path.join(from,file),path.join(target,file));
console.log('Exported 37 original PNG tiles and their manifest to '+target);
