import fs from 'node:fs';const p='worker/index.js';let s=fs.readFileSync(p,'utf8');const a=s.indexOf('export async function gemini('),b=s.indexOf('\nexport function searchRedirect',a);
const code=`export function modelSequence(env){const primary=(env.GEMINI_MODEL||'gemini-2.5-flash').replace(/^models\\//,'');const alternatives=(env.GEMINI_FALLBACK_MODELS||'gemini-3.5-flash,gemini-2.5-flash-lite').split(',').map(x=>x.trim().replace(/^models\\//,''));return [...new Set([primary,...alternatives])].filter(x=>/^gemini-[a-z0-9.-]+$/.test(x)).slice(0,3);}
export async function gemini(env,contents,system,search=false){
 const models=modelSequence(env);let lastError;
 for(const model of models){
  try{
   const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:0.35,maxOutputTokens:6144},...(search?{tools:[{google_search:{}}]}:{})}),signal:AbortSignal.timeout(60000)});
   if(!response.ok){
    const details=await response.json().catch(()=>({}));const message=details.error?.message||'';
    const fallback=response.status===429||response.status>=500||response.status===404||(response.status===400&&/tool|grounding|google_search|not supported/i.test(message))||(response.status===403&&/model.*access|access.*model/i.test(message));
    const error=Object.assign(new Error(fallback?'Os serviços estão ocupados ou indisponíveis. Não consegui concluir a resposta desta vez.':'Não foi possível concluir sua pergunta. Tente novamente mais tarde.'),{retryable:fallback,permanent:!fallback});
    if(!fallback)throw error;lastError=error;continue;
   }
   const data=await response.json();const candidate=data.candidates?.[0];
   if(data.promptFeedback?.blockReason||['SAFETY','PROHIBITED_CONTENT','BLOCKLIST','RECITATION'].includes(candidate?.finishReason))throw Object.assign(new Error('Não consegui elaborar uma resposta para essa pergunta. Você pode reformulá-la.'),{retryable:false,permanent:true});
   const text=(candidate?.content?.parts||[]).filter(p=>!p.thought).map(p=>p.text||'').join('').trim();
   if(!text){lastError=Object.assign(new Error('Não consegui preparar uma resposta desta vez.'),{retryable:true});continue;}
   return {text,metadata:candidate.groundingMetadata,model};
  }catch(error){if(error.permanent)throw error;lastError=Object.assign(new Error('A consulta foi interrompida e os modelos alternativos não conseguiram responder.'),{retryable:true});}
 }
 throw lastError||Object.assign(new Error('Não há modelo disponível para responder.'),{retryable:false});
}
`;
s=s.slice(0,a)+code+s.slice(b);fs.writeFileSync(p,s);
let t=fs.readFileSync('retry.test.mjs','utf8').replace("assert.equal(calls,2)}finally{globalThis.fetch=original}});","assert.equal(calls,3)}finally{globalThis.fetch=original}});");fs.writeFileSync('retry.test.mjs',t);
