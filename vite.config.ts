import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

function assetFiles(directory: string, relativePath = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${relativePath}${entry.name}`;
    return entry.isDirectory() ? assetFiles(resolve(directory, entry.name), `${path}/`) : [path];
  }).sort();
}

function outputFileForUrl(url: string): string {
  if (url === '/') return 'index.html';
  return url.endsWith('/') ? `${url.slice(1)}index.html` : url.slice(1);
}

function offlineShell(): Plugin {
  return {
    name: 'revision-receipts-offline-shell',
    writeBundle(options) {
      const outputDirectory = options.dir ?? resolve(import.meta.dirname, 'dist');
      // Vite's Rollup bundle records can include source-map-only placeholder
      // chunks that are not written. Build the shell from the finished assets
      // on disk so every precache request has a real deployment artifact.
      const urls = [
        '/',
        '/index.html',
        '/privacy/',
        '/terms/',
        '/manifest.webmanifest',
        '/mark.svg',
        ...assetFiles(resolve(outputDirectory, 'assets'))
          .filter((file) => !file.endsWith('.map'))
          .map((file) => `/assets/${file}`),
      ];
      const revisionHash = createHash('sha256').update(urls.join('\n'));
      for (const url of urls) {
        revisionHash.update(readFileSync(resolve(outputDirectory, outputFileForUrl(url))));
      }
      const revision = revisionHash.digest('hex').slice(0, 12);
      const source = `const CACHE='revision-receipts-${revision}';
const SHELL=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok&&new URL(event.request.url).origin===location.origin){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match('/index.html'))));});`;
      writeFileSync(resolve(outputDirectory, 'sw.js'), source);
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
