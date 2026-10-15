import {nativeSearch,document} from './worker/index.js';
const query=process.argv[2]||'Por que Deus permite o sofrimento?';
const links=await nativeSearch(query);console.log('Links reais encontrados:',links.length);
const results=await Promise.all(links.slice(0,5).map(async url=>{try{const article=await document(url);return {url,ok:!!article,title:article?.title,characters:article?.text.length};}catch(e){return {url,ok:false,error:e.cause?.code||e.name};}}));console.log(JSON.stringify(results,null,2));if(!results.some(r=>r.ok))process.exitCode=1;
