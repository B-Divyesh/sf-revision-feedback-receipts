import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

function offlineShell(): Plugin {
  return {
    name: 'revision-receipts-offline-shell',
    generateBundle(_options, bundle) {
      const urls = ['/', '/index.html', '/privacy/', '/terms/', '/manifest.webmanifest', '/mark.svg', '/assets/hero-receipt-768.webp', '/assets/hero-receipt-1280.webp'];
      for (const name of Object.keys(bundle)) urls.push(`/${name}`);
      const source = `const CACHE='revision-receipts-v1';
const SHELL=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok&&new URL(event.request.url).origin===location.origin){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match('/index.html'))));});`;
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        terms: resolve(import.meta.dirname, 'terms/index.html'),
      },
    },
  },
  plugins: [offlineShell()],
});
