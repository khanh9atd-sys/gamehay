/* Service worker: lưu app để dùng offline. Đổi số phiên bản khi cập nhật file. */
const C="tutien-v1";
const CORE=["./","./index.html","./manifest.webmanifest","./icons/tutien-192.png","./icons/tutien-512.png","./icons/tutien-maskable-512.png","./icons/tutien-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("tutien-")&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin===location.origin){if(u.pathname.includes("/hoc/"))return;
    if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put("./index.html",cp))}return res}).catch(()=>caches.match("./index.html")));return}
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));return}
  if(/fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|unpkg\.com/.test(u.host)){
    e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>{const f=fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>m);return m||f})))}
});
