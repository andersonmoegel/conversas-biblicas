import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker,{allowed} from './worker/index.js';
test('valida fronteira do domínio',()=>{for(const u of ['https://jw.org/','https://www.jw.org/pt/','https://wol.jw.org/pt/'])assert.equal(allowed(u),true);for(const u of ['https://jw.org.evil.com','https://eviljw.org','http://jw.org','https://user@jw.org','https://jw.org:444','file:///etc/passwd'])assert.equal(allowed(u),false)});
test('sem chave retorna configuração pendente',async()=>{const r=await worker.fetch(new Request('http://localhost/api/chat',{method:'POST'}),{});assert.equal(r.status,503);assert.match((await r.json()).error,/temporariamente indisponível/)});
test('bloqueia origem externa',async()=>{const r=await worker.fetch(new Request('http://localhost/api/chat',{method:'POST',headers:{origin:'https://outro.site'}}),{});assert.equal(r.status,403)});
test('interface é servida e status não expõe segredo',async()=>{const r=await worker.fetch(new Request('http://localhost/'),{});assert.match(await r.text(),/Conversas Bíblicas/);const status=await worker.fetch(new Request('http://localhost/api/status'),{GEMINI_API_KEY:'secret'});assert.deepEqual(await status.json(),{configured:true,readerVersion:'jw-search-v3'})});

