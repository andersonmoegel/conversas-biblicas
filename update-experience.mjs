import fs from 'node:fs';const p='worker/index.js';let s=fs.readFileSync(p,'utf8');
s=s.replace('Responda em português brasileiro com cordialidade, humildade e respeito, na perspectiva das Testemunhas de Jeová.','Responda em português brasileiro com carinho, empatia, humildade e respeito, na perspectiva das Testemunhas de Jeová. Acolha primeiro a pergunta de forma natural e específica, sem frases prontas repetidas. Fale diretamente com a pessoa, com ternura e serenidade, como numa conversa atenciosa. Evite tom de palestra e expressões impessoais como "o documento explica". Ao falar de dor, ansiedade ou tristeza, reconheça que pode ser difícil; nunca atribua sofrimento a falta de fé, materialismo ou falha moral da pessoa. Não prometa cura nem resultados garantidos; respeite apoio profissional e não sugira substituir tratamentos por práticas religiosas. Ofereça consolo e pequenas aplicações práticas apenas quando sustentadas pelas fontes. Não presuma sentimentos ou situações que a pessoa não contou. Não invente experiências pessoais ou intimidade.');
s=s.replace('Na resposta curta, limite-se a 160 palavras.','Na resposta inicial, use aproximadamente 180 a 260 palavras quando isso ajudar a acolher e explicar bem; perguntas simples podem receber respostas menores. Priorize o cuidado e a precisão, não a rapidez.');
s=s.replace("'Responda brevemente, em até 160 palavras.'","'Responda com acolhimento, explicação clara e consolo baseado nas fontes, em aproximadamente 180 a 260 palavras quando necessário. Não transforme a resposta em sermão.'");
s=s.replace('async function gemini(env, contents, system, search=false) {','export async function gemini(env, contents, system, search=false) {');
const begin=s.indexOf(' let response;for(let attempt=');const finish=s.indexOf(' const data = await response.json();',begin);
s=s.slice(0,begin)+` let response;
 for(let attempt=0;attempt<2;attempt++){
  try{response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(env.GEMINI_MODEL||'gemini-2.5-flash')+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:0.35,maxOutputTokens:6144},...(search?{tools:[{google_search:{}}]}:{})}),signal:AbortSignal.timeout(75000)});}catch(error){if(attempt===0)continue;throw Object.assign(new Error('A conexão foi interrompida. Não consegui concluir a resposta desta vez.'),{retryable:true});}
  if(response.ok)break;
  const transient=response.status===429||response.status>=500;
  if(transient&&attempt===0){const delay=Math.min(10000,Math.max(1000,Number(response.headers.get('retry-after')||1)*1000));await response.body?.cancel();await new Promise(resolve=>setTimeout(resolve,delay));continue;}
  throw Object.assign(new Error(transient?'O serviço está ocupado no momento. Não consegui concluir a resposta desta vez.':'Não foi possível concluir sua pergunta. Tente novamente mais tarde.'),{retryable:transient});
 }
`+s.slice(finish);
s=s.replace("if(!candidate?.content?.parts) throw new Error('Não foi possível elaborar uma resposta. Tente reformular a pergunta.');","if(!candidate?.content?.parts) throw Object.assign(new Error('Não consegui preparar uma resposta desta vez.'),{retryable:true});");
// Repair unsupported citation formatting once using the already retrieved documents.
s=s.replace('   const result=await gemini(env,','   let result=await gemini(env,');
const c=s.indexOf('   result.text=normalizeCitations(result.text);');const d=s.indexOf('   return json({text:result.text,sources:',c);
s=s.slice(0,c)+`   result.text=normalizeCitations(result.text);
   let cited=[...result.text.matchAll(/\\[(\\d+)\\]/g)].map(m=>Number(m[1]));
   if(!cited.length||cited.some(n=>n<1||n>docs.length)){
    result=await gemini(env,[{role:'user',parts:[{text:'Escreva novamente uma resposta acolhedora para esta pergunta: '+body.message+'\\nUse somente estas fontes e cite cada afirmação religiosa com [n], onde n esteja entre 1 e '+docs.length+'. Não invente referências. Se o material for insuficiente, diga isso.\\n'+context}]}],policy);
    result.text=normalizeCitations(result.text);cited=[...result.text.matchAll(/\\[(\\d+)\\]/g)].map(m=>Number(m[1]));
   }
   if(!cited.length||cited.some(n=>n<1||n>docs.length))return json({text:'Quero tratar sua pergunta com cuidado, mas não consegui confirmar uma explicação suficiente nos materiais consultados. Você pode conferir as fontes abaixo.',sources:docs.map(({url,title,text})=>({url,title,excerpt:excerpt(text,body.message)})),insufficient:true,retryable:false});
`+s.slice(d);
s=s.replace("e.message||'Falha ao consultar as fontes.'},502)","e.message||'Falha ao consultar as fontes.',retryable:e.retryable===true},502)");
s=s.replace("return json({error:'O assistente está temporariamente indisponível. Tente novamente mais tarde.'},503)","return json({error:'O assistente está temporariamente indisponível. Tente novamente mais tarde.',retryable:false},503)");
const a=s.indexOf(" lastRequest={message,mode};");const b=s.indexOf('\nfunction closeMenu()',a);
const client=fs.readFileSync('loading-client.txt','utf8');s=s.slice(0,a)+client+s.slice(b);
s=s.replace('</style>',fs.readFileSync('loading-style.txt','utf8')+'</style>');
fs.writeFileSync(p,s);
