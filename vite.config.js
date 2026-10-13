import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

function storeApiPlugin() {
  const storeFilePath = resolve(__dirname, 'store_data.json');

  const handleMiddleware = (req, res, next) => {
    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;

    if (pathname === '/api/store') {
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        if (fs.existsSync(storeFilePath)) {
          try {
            const data = fs.readFileSync(storeFilePath, 'utf-8');
            res.statusCode = 200;
            res.end(data);
            return;
          } catch (e) {
            console.error('Failed reading store_data.json:', e);
          }
        }
        res.statusCode = 200;
        res.end(JSON.stringify({ exists: false }));
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            fs.writeFileSync(storeFilePath, JSON.stringify(parsed, null, 2), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, timestamp: Date.now() }));
          } catch (e) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }
    }

    if (pathname === '/api/store/reset' && req.method === 'POST') {
      if (fs.existsSync(storeFilePath)) {
        try { fs.unlinkSync(storeFilePath); } catch (e) {}
      }
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, reset: true }));
      return;
    }

    next();
  };

  return {
    name: 'store-api-plugin',
    configureServer(server) {
      server.middlewares.use(handleMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleMiddleware);
    }
  };
}

export default defineConfig({
  plugins: [storeApiPlugin()],
  server: {
    watch: {
      ignored: ['**/store_data.json']
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
