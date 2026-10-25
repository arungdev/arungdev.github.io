import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      if (res.id && this.pending.has(res.id)) {
        const p = this.pending.get(res.id);
        this.pending.delete(res.id);
        if (res.error) p.reject(res.error);
        else p.resolve(res.result);
      }
    };
  }

  send(method, params = {}, sessionId) {
    const reqId = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(reqId, { resolve, reject });
      const msg = { id: reqId, method, params };
      if (sessionId) msg.sessionId = sessionId;
      this.ws.send(JSON.stringify(msg));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'_build/.demo-runtime/responsive');
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(5198,'127.0.0.1',r));
const browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--remote-debugging-port=9340',`--user-data-dir=${out}/chrome`,'about:blank'],{stdio:'ignore'});
let cdp;
try {
  let version;
  for(let i=0;i<30;i++){try{version=await(await fetch('http://127.0.0.1:9340/json/version')).json();break;}catch{await new Promise(r=>setTimeout(r,200));}}
  cdp=new CdpClient(version.webSocketDebuggerUrl);await cdp.connect();
  const {targetId}=await cdp.send('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await cdp.send('Target.attachToTarget',{targetId,flatten:true});
  const send=(method,params={})=>cdp.send(method,params,sessionId);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
  let failures=[];
  for(const width of [320,375,430,768,1024,1440,1920]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    for(const page of ['/','/bankstatementanalytics/','/docs/','/about/','/changelog/','/404.html']){
      await send('Page.navigate',{url:`http://127.0.0.1:5198${page}`});
      for(let ready=0;ready<100;ready++) {
        await new Promise(r=>setTimeout(r,100));
        if(await evaluate(`location.pathname===${JSON.stringify(page)} && document.readyState==='complete' && !!document.querySelector('.has-menu')`))break;
        if(ready===99)throw new Error('Page did not finish initializing: '+page);
      }
      await evaluate('document.fonts.ready.then(()=>true)');
      if(width<=760){
        const menu=await evaluate(`(() => {
          const button=document.querySelector('.menu-toggle');button.click();
          const links=[...document.querySelectorAll('.site-nav a')];
          return button.getAttribute('aria-expanded')==='true'&&links.length===5&&links.every(a=>{const r=a.getBoundingClientRect();return r.width>0&&r.left>=0&&r.right<=innerWidth;});
        })()`);
        await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
        await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
        if(!menu||!await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'`)) failures.push({width,page,error:'Mobile menu failed',detail:await evaluate(`({expanded:document.querySelector('.menu-toggle').getAttribute('aria-expanded'),links:[...document.querySelectorAll('.site-nav a')].map(a=>({text:a.textContent,width:a.getBoundingClientRect().width,left:a.getBoundingClientRect().left,right:a.getBoundingClientRect().right}))})`)});
      }
      if(page==='/bankstatementanalytics/') {
        await evaluate(`document.querySelectorAll('.version-checksum').forEach(e=>e.open=true)`);
        const modal=await evaluate(`(() => {document.querySelector('.shot').click();const box=document.querySelector('.lightbox');const r=box.getBoundingClientRect();return box.classList.contains('open')&&r.width<=innerWidth;})()`);
        await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
        if(!modal||!await evaluate(`!document.querySelector('.lightbox').classList.contains('open')`))failures.push({width,page,error:'Screenshot dialog failed'});
        await evaluate('window.scrollTo(0,0)');
      }
      const result=await evaluate(`(() => {
        const width=document.documentElement.clientWidth;
        return {overflow:document.documentElement.scrollWidth>width+1, offenders:[...document.querySelectorAll('main *,header *,footer *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>width+1&&!e.closest('.table-scroll,.tour-nav,.site-nav,.lightbox');}).slice(0,8).map(e=>e.tagName+'.'+e.className),brokenImages:[...document.images].filter(e=>e.complete&&e.naturalWidth===0&&e.getAttribute('src')).length};
      })()`);
      if(result.overflow||result.brokenImages) failures.push({width,page,...result});
      if(width===375||width===1440){const {data}=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,`${page.replaceAll('/','_')}-${width}.png`),Buffer.from(data,'base64'));}
    }
  }
  console.log(JSON.stringify({checks:42,failures},null,2));
  if(failures.length)process.exitCode=1;
}finally{cdp?.close();browser.kill();server.close();}
