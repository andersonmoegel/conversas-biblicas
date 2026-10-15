import {gemini} from './worker/index.js';
const result=await gemini({...process.env,GEMINI_MODEL:'gemini-modelo-inexistente',GEMINI_FALLBACK_MODELS:'gemini-3.5-flash,gemini-2.5-flash-lite'},[{role:'user',parts:[{text:'Responda somente: teste concluído'}]}],'Responda brevemente em português.');console.log(JSON.stringify({modeloQueRespondeu:result.model,resposta:result.text}));

