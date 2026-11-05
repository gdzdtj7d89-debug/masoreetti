/* MASOREETTI service worker: toimii ilman verkkoa. Nosta VERSION, kun julkaiset uuden version. */
const VERSION="masoreetti-v4.9.1";
const CORE=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","opas/1-koti.jpg","opas/2-oppitunti.jpg","opas/3-foryou.jpg","opas/4-opi.jpg","opas/5-patriarkat.jpg","opas/6-tori.jpg","opas/7-mina.jpg","opas/8-kauppa.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin===location.origin){
    // sivu: verkko ensin (saat päivitykset), välimuisti varalla
    if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put("index.html",cp));return res}).catch(()=>caches.match("index.html")));return}
    e.respondWith(caches.match(r).then(m=>m||fetch(r)));return}
  if(/fonts\.(googleapis|gstatic)\.com/.test(u.host)){e.respondWith(caches.open(VERSION+"-fonts").then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{c.put(r,res.clone());return res}))))}
});
