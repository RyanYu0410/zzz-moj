const esbuild=require('esbuild-wasm');
Promise.all([
 esbuild.build({entryPoints:['src/game.js'],bundle:true,platform:'browser',target:'es2020',outfile:'dist/game.js',legalComments:'eof'}),
 esbuild.build({entryPoints:['src/ai-worker.js'],bundle:true,platform:'browser',target:'es2020',outfile:'dist/ai-worker.js',legalComments:'eof'})
]).catch(()=>process.exit(1));
