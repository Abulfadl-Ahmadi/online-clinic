// Run against an already-running production server. Uses Chrome DevTools without extra dependencies.
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const chrome = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const origin = process.env.AUDIT_ORIGIN || 'http://localhost:3000';
const paths = process.env.AUDIT_REDUCED_MOTION === '1' ? ['/', '/en', '/clinic', '/en/clinic'] : ['/', '/about-us', '/clinic', '/articles', '/en', '/en/about', '/en/clinic', '/en/articles', '/auth/login', '/auth/register'];
const reducedMotionAudit = process.env.AUDIT_REDUCED_MOTION === '1';
const localeCounterparts = {'/':'/en','/about-us':'/en/about','/clinic':'/en/clinic','/articles':'/en/articles','/en':'/','/en/about':'/about-us','/en/clinic':'/clinic','/en/articles':'/articles'};
const failures = [];
const profile = await mkdtemp(join(tmpdir(), 'clinic-theme-audit-'));
const browser = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9238', '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });
const waitFor = async (fn) => { for (let i=0;i<30;i++) { try { return await fn(); } catch { await delay(350); } } throw Error('Chrome protocol unavailable'); };
let nextId=0;
async function connect() {
  const targets = await waitFor(async () => { const response = await fetch('http://localhost:9238/json'); if (!response.ok) throw Error('No targets'); return response.json(); });
  const target = targets.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject) => { ws.onopen=resolve; ws.onerror=reject; });
  const pending = new Map();
  ws.onmessage = event => { const data=JSON.parse(event.data); if (data.id && pending.has(data.id)) { const {resolve,reject}=pending.get(data.id); pending.delete(data.id); if (data.error) reject(Error(data.error.message)); else resolve(data.result); } };
  const send = (method,params={}) => new Promise((resolve,reject) => { const id=++nextId; pending.set(id,{resolve,reject}); ws.send(JSON.stringify({id,method,params})); });
  return {ws,send};
}
const evaluate = async (send,expression) => { const data = await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}); if (data.exceptionDetails) throw Error(data.exceptionDetails.text); return data.result.value; };
const contrast = (a,b) => { const luminance = c => { if (!c?.startsWith('rgb(')) return null; const rgb = c.match(/[\d.]+/g)?.slice(0,3).map(Number); if (!rgb || rgb.length < 3) return null; const linear=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return .2126*linear[0]+.7152*linear[1]+.0722*linear[2];};const x=luminance(a),y=luminance(b);return x===null||y===null?null:Math.round((Math.max(x,y)+.05)/(Math.min(x,y)+.05)*100)/100; };
try {
 const {ws,send}=await connect(); await send('Page.enable'); await send('Runtime.enable');
 await send('Page.addScriptToEvaluateOnNewDocument', {source: "try { localStorage.setItem('theme', 'system'); } catch {}"});
 for (const theme of ['light','dark']) for (const width of [390,1440]) for (const path of paths) {
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme}, ...(reducedMotionAudit ? [{name:'prefers-reduced-motion',value:'reduce'}] : [])]});
  await send('Page.navigate',{url:origin+path});
  try {
    await waitFor(async () => {
      const ready = await evaluate(send, `document.readyState === 'complete' && document.querySelector('h1') !== null`);
      if (!ready) throw Error('Page still loading');
    });
  } catch {
    const state = await evaluate(send, `({url:location.href,title:document.title,ready:document.readyState,h1:document.querySelector('h1')?.textContent?.slice(0,50)})`);
    throw Error(`Page did not finish loading: ${theme} ${width}px ${path} ${JSON.stringify(state)}`);
  }
  const data=await evaluate(send,`(() => { const root=document.querySelector('.brand-page'); const main=root||document.body; const s=getComputedStyle(main); const top=document.querySelector('header, nav'); const h=top?getComputedStyle(top):null; const button=[...document.querySelectorAll('a,button')].find(e=>e.getBoundingClientRect().width>0 && e.getBoundingClientRect().height>0 && e.textContent.trim().length>2); const bs=button?getComputedStyle(button):null; return {title:document.title, theme:document.documentElement.className, background:s.backgroundColor, foreground:s.color, headerBackground:h?.backgroundColor, headerForeground:h?.color, buttonText:button?.textContent.trim().slice(0,30),buttonBackground:bs?.backgroundColor,buttonForeground:bs?.color,heroText:root?.querySelector('h1')?getComputedStyle(root.querySelector('h1')).color:null,heroBackground:root?.querySelector('h1')?getComputedStyle(root.querySelector('h1').closest('.brand-motion-field')||root).backgroundColor:null,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),galleryButtons:document.querySelectorAll('button[aria-label^="نمایش بزرگ‌تر تصویر"],button[aria-label^="Enlarge clinic photo"]').length,insurerLogos:[...document.querySelectorAll('section[aria-labelledby="insurance-cloud-title"] img')].map(image=>image.getAttribute('src')),themeButtons:[...document.querySelectorAll('button[aria-label^="تغییر تم"],button[aria-label^="Change theme"]')].filter(e=>e.getBoundingClientRect().width>0).length,h1:document.querySelector('h1')?.textContent?.trim().slice(0,65)||null}; })()`);
  const score = contrast(data.foreground,data.background);
  if (data.overflow > 0) failures.push(`${theme} ${width}px ${path}: horizontal overflow ${data.overflow}px`);
  if (score !== null && score < 4.5) failures.push(`${theme} ${width}px ${path}: insufficient page text contrast ${score}`);
  if (data.h1 === null) failures.push(`${theme} ${width}px ${path}: missing h1`);
  await evaluate(send, `document.activeElement?.blur()`);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  const mainCount = await evaluate(send, `document.querySelectorAll('main').length`);
  if (mainCount !== 1) failures.push(`${theme} ${width}px ${path}: expected one main landmark, found ${mainCount}`);
  const skip = await evaluate(send, `(() => { const link=document.querySelector('a.brand-skip-link'); const main=document.querySelector('main#main-content'); if (!link || !main) return null; const focusVisible=document.activeElement===link && link.matches(':focus-visible'); if (focusVisible) link.click(); return {href:link.getAttribute('href'),focusVisible,mainFocus:document.activeElement===main,hash:location.hash}; })()`);
  if (!skip || skip.href !== '#main-content' || !skip.focusVisible || (!skip.mainFocus && skip.hash !== '#main-content')) failures.push(`${theme} ${width}px ${path}: keyboard skip link cannot reach main content (${JSON.stringify(skip)})`);
  if (reducedMotionAudit) {
    const motion = await evaluate(send, `(() => { const orb=document.querySelector('.brand-orb'); const card=document.querySelector('.brand-card'); return {prefersReduced:matchMedia('(prefers-reduced-motion: reduce)').matches,scroll:getComputedStyle(document.documentElement).scrollBehavior,orbDuration:orb?getComputedStyle(orb).animationDuration:null,cardDuration:card?getComputedStyle(card).transitionDuration:null}; })()`);
    if (!motion.prefersReduced || motion.scroll !== 'auto') failures.push(`${theme} ${width}px ${path}: reduced-motion preference or scroll behavior not respected`);
    for (const [label,value] of [['orb',motion.orbDuration],['card',motion.cardDuration]]) {
      if (value && value.split(',').some(duration => parseFloat(duration) > 0.01)) failures.push(`${theme} ${width}px ${path}: ${label} animation persists (${value})`);
    }
  }
  if (path.startsWith('/en')) {
    const booking = await evaluate(send, `(() => { const links=[...document.querySelectorAll('a[href="/auth/login"]')].filter(a=>a.textContent.includes('Book (Persian portal)')); const nav=document.querySelector('nav[aria-label="English mobile navigation"]'); return {mobile:!!nav && links.some(link=>nav.contains(link) && link.getBoundingClientRect().width>0),desktop:links.some(link=>!nav?.contains(link) && link.getBoundingClientRect().width>0)}; })()`);
    if (width === 390 && !booking.mobile) failures.push(`${theme} ${width}px ${path}: English mobile booking link missing or hidden`);
    if (width === 1440 && !booking.desktop) failures.push(`${theme} ${width}px ${path}: English desktop booking link missing or hidden`);
  }
  if (localeCounterparts[path]) {
    const target = path.startsWith('/en') ? 'fa' : 'en';
    const actual = await evaluate(send, `document.querySelector('a[hreflang="${target}"]')?.getAttribute('href')`);
    if (actual !== localeCounterparts[path]) failures.push(`${theme} ${width}px ${path}: language switch points to ${actual}, expected ${localeCounterparts[path]}`);
  }
  if (['/clinic','/en/clinic'].includes(path) && data.galleryButtons < 1) failures.push(`${theme} ${width}px ${path}: gallery controls missing`);
  if (['/','/clinic','/en','/en/clinic'].includes(path)) {
    if (data.insurerLogos.length !== 2) failures.push(`${theme} ${width}px ${path}: expected two sourced insurer emblems, found ${data.insurerLogos.length}`);
    for (const file of ['social-security.png','central-bank.png']) {
      const image = `document.querySelector('section[aria-labelledby="insurance-cloud-title"] img[src*="${file}"]')`;
      await evaluate(send, `${image}?.scrollIntoView({block:'center'})`);
      try {
        await waitFor(async () => { if (!(await evaluate(send, `!!${image}?.complete && ${image}.naturalWidth > 0`))) throw Error('Image not loaded'); });
      } catch { failures.push(`${theme} ${width}px ${path}: ${file} did not decode`); }
    }
  }
  if (data.themeButtons < 1) {
    await delay(350);
    const settledButtons = await evaluate(send, `[...document.querySelectorAll('button[aria-label^="تغییر تم"],button[aria-label^="Change theme"]')].filter(e=>e.getBoundingClientRect().width>0).length`);
    if (settledButtons < 1) failures.push(`${theme} ${width}px ${path}: visible theme switch missing`);
  }
  if (data.theme !== theme) failures.push(`${theme} ${width}px ${path}: theme class is ${data.theme}`);
  if (width === 390 && path === '/') {
    await delay(750);
    const before = await evaluate(send, `({stored: localStorage.getItem('theme'), current: document.documentElement.className, label: document.querySelector('button[aria-label^="تغییر تم"]')?.getAttribute('aria-label')})`);
    await evaluate(send, `document.querySelector('button[aria-label^="تغییر تم"]').click()`);
    const expected = before.stored === 'system' ? 'light' : before.stored === 'light' ? 'dark' : 'system';
    const expectedClass = expected === 'system' ? theme : expected;
    try {
      await waitFor(async () => { if (!(await evaluate(send, `localStorage.getItem('theme') === '${expected}' && document.documentElement.classList.contains('${expectedClass}')`))) throw Error('Theme did not change'); });
    } catch { failures.push(`${theme} ${width}px ${path}: theme toggle failed from ${JSON.stringify(before)} to ${expected}`); }
  }
  if (width === 390 && path === '/') {
    await waitFor(async () => { if (!(await evaluate(send, `document.querySelector('button[aria-label="باز کردن فهرست راهبری"]') !== null`))) throw Error('Mobile navigation not ready'); });
    await evaluate(send, `document.querySelector('button[aria-label="باز کردن فهرست راهبری"]').click()`);
    try {
      await waitFor(async () => { if (!(await evaluate(send, `!!document.querySelector('[role="dialog"][data-state="open"]')`))) throw Error('Navigation did not open'); });
      await send('Input.dispatchKeyEvent', {type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await send('Input.dispatchKeyEvent', {type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
      await waitFor(async () => { if (await evaluate(send, `!!document.querySelector('[role="dialog"][data-state="open"]')`)) throw Error('Escape did not close navigation'); });
    } catch { failures.push(`${theme} ${width}px ${path}: mobile navigation did not open and close with Escape`); }
  }
  if (path.startsWith('/auth/')) {
    const overlap = await evaluate(send, `(() => { const h=document.querySelector('header')?.getBoundingClientRect(); const card=document.querySelector('[data-slot="card"]')?.getBoundingClientRect(); return h && card ? Math.max(0, Math.min(h.bottom, card.bottom)-Math.max(h.top,card.top)) : null; })()`);
    if (overlap === null) failures.push(`${theme} ${width}px ${path}: auth header or form card missing`);
    else if (overlap > 0) failures.push(`${theme} ${width}px ${path}: auth header overlaps form by ${overlap}px`);
  }
  if (data.title.includes('404') || data.title.includes('Not Found')) failures.push(`${theme} ${width}px ${path}: error page`);
  console.log(JSON.stringify({path,theme,width,...data,contrast:score,buttonContrast:contrast(data.buttonForeground,data.buttonBackground)}));
 }
 ws.close();
 if (failures.length) { console.error(failures.join('\n')); process.exitCode=1; }
} finally { browser.kill(); await delay(400); await rm(profile, {recursive:true,force:true,maxRetries:4,retryDelay:300}); }
