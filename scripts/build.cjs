const esbuild=require('esbuild-wasm');
const fs=require('node:fs'),crypto=require('node:crypto');
const digest=files=>crypto.createHash('sha256').update(files.map(f=>fs.readFileSync(f)).join('\n')).digest('hex').slice(0,12);
async function build(){
 const version=digest(['src/game.js','src/start-screen.js','src/ui-icons.js','src/preferences.js','src/i18n.js','src/scene-resources.js','src/engine.js','src/ai-worker.js','package-lock.json']);
 await Promise.all([
  esbuild.build({entryPoints:['src/game.js'],bundle:true,platform:'browser',target:'es2020',outfile:'dist/game.js',legalComments:'eof',define:{__BUILD_VERSION__:JSON.stringify(version)}}),
  esbuild.build({entryPoints:['src/ai-worker.js'],bundle:true,platform:'browser',target:'es2020',outfile:'dist/ai-worker.js',legalComments:'eof'})
 ]);
 let html=fs.readFileSync('dist/index.html','utf8');
 html=html.replace(/href="style\.css(?:\?[^" ]*)?"/g,'href="style.css?v='+digest(['dist/style.css'])+'"').replace(/src="game\.js(?:\?[^" ]*)?"/g,'src="game.js?v='+digest(['dist/game.js'])+'"');
 fs.writeFileSync('dist/index.html',html);
}
build().catch(e=>{console.error(e);process.exit(1)});
