import test from 'node:test';
import assert from 'node:assert/strict';
import {requestURL} from './request-url.mjs';
import worker from './worker/index.js';

test('Vercel browser requests reach chat while foreign origins remain blocked', async () => {
  const req = {url:'/api/chat',headers:{host:'localhost:3000','x-forwarded-host':'conversas-biblicas.vercel.app'}};
  const url = requestURL(req,{VERCEL:'1'});
  assert.equal(url.origin,'https://conversas-biblicas.vercel.app');
  const make = origin => new Request(url,{method:'POST',headers:{origin},body:'{}'});
  const own = await worker.fetch(make(url.origin),{});
  assert.equal(own.status,503); // No key in this test: the origin guard passed.
  const foreign = await worker.fetch(make('https://example.com'),{});
  assert.equal(foreign.status,403);
});
test('local host, port and query survive without trusting proxy or origin headers',()=>{
  const req={url:'/api/chat?mode=bible',headers:{host:'localhost:3001','x-forwarded-host':'example.com',origin:'https://example.com'}};
  assert.equal(requestURL(req,{}).href,'http://localhost:3001/api/chat?mode=bible');
});
test('Vercel host fallback and unsafe host handling',()=>{
  assert.equal(requestURL({url:'//evil.test/api',headers:{host:'app.vercel.app'}},{VERCEL:'1'}).origin,'https://app.vercel.app');
  assert.throws(()=>requestURL({url:'/',headers:{host:'app.test@evil.test'}},{}));
});
