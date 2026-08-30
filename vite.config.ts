import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
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

function writeDemoPage(outputDirectory: string): void {
  const index = readFileSync(resolve(outputDirectory, 'index.html'), 'utf8');
  const demo = index
    .replace(/<link rel="canonical" href="[^"]+"\s*\/>/, '<link rel="canonical" href="https://revision-feedback-receipts.sociobot.in/demo" />')
    .replace(/<meta property="og:title" content="[^"]+"\s*\/>/, '<meta property="og:title" content="Demo — Revision Receipts" />')
    .replace(/<meta property="og:url" content="[^"]+"\s*\/>/, '<meta property="og:url" content="https://revision-feedback-receipts.sociobot.in/demo" />')
    .replace(/<meta name="twitter:title" content="[^"]+"\s*\/>/, '<meta name="twitter:title" content="Demo — Revision Receipts" />')
    .replace(/<title>[^<]+<\/title>/, '<title>Demo — Revision Receipts</title>');
  const demoDirectory = resolve(outputDirectory, 'demo');
  mkdirSync(demoDirectory, { recursive: true });
  writeFileSync(resolve(demoDirectory, 'index.html'), demo);
}

function offlineShell(): Plugin {
  return {
    name: 'revision-receipts-offline-shell',
    writeBundle(options) {
      const outputDirectory = options.dir ?? resolve(import.meta.dirname, 'dist');
      writeDemoPage(outputDirectory);
      // Vite's Rollup bundle records can include source-map-only placeholder
      // chunks that are not written. Build the shell from the finished assets
      // on disk so every precache request has a real deployment artifact.
      const urls = [
        '/',
        '/index.html',
        '/demo/',
        '/privacy/',
        '/terms/',
        '/404.html',
        '/manifest.webmanifest',
        '/mark.svg',
        '/apple-touch-icon.png',
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
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const path=new URL(event.request.url).pathname;const fallback=path==='/demo'||path.startsWith('/demo/')?'/demo/':'/index.html';event.respondWith(caches.match(event.request,{ignoreVary:true}).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok&&new URL(event.request.url).origin===location.origin){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>event.request.mode==='navigate'?caches.match(fallback,{ignoreVary:true}):Response.error())));});`;
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
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
  plugins: [offlineShell()],
});
