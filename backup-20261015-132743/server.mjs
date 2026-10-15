import http from 'node:http';
import worker from './worker/index.js';
const port=Number(process.env.PORT||3000);
http.createServer(async(req,res)=>{try{const chunks=[];let size=0;for await(const c of req){size+=c.length;if(size>24000){res.writeHead(413);res.end('Pedido muito grande');return;}chunks.push(c);}const request=new Request('http://localhost:'+port+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});const response=await worker.fetch(request,process.env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch{res.writeHead(500);res.end('Erro interno');}}).listen(port,'127.0.0.1',()=>console.log('Local: http://localhost:'+port));
