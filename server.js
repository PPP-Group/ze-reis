import http from 'node:http'
import fs   from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const PORT     = Number(process.env.PORT) || 3000
const ROOT_DIR = path.resolve('.')          // site estático na raiz — sem build step

const MIME_TYPES = {
  '.html':  'text/html; charset=utf-8',
  '.js':    'application/javascript; charset=utf-8',
  '.mjs':   'application/javascript; charset=utf-8',
  '.css':   'text/css; charset=utf-8',
  '.json':  'application/json; charset=utf-8',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.webp':  'image/webp',
  '.svg':   'image/svg+xml',
  '.ico':   'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff':  'font/woff',
  '.ttf':   'font/ttf',
  '.txt':   'text/plain; charset=utf-8',
}

const server = http.createServer((req, res) => {
  const urlPath  = decodeURIComponent(req.url.split('?')[0])
  let   filePath = path.join(ROOT_DIR, urlPath === '/' ? 'index.html' : urlPath)

  // Previne directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }

  // Se não existe ou é diretório, serve index.html (SPA fallback)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT_DIR, 'index.html')
  }

  const ext         = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'
  const isHtml      = ext === '.html'
  const isAsset     = urlPath.startsWith('/assets/')

  const headers = {
    'Content-Type':           contentType,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control':          isAsset ? 'public, max-age=31536000, immutable'
                            : isHtml  ? 'no-cache'
                            :           'public, max-age=604800',
  }

  const raw            = fs.createReadStream(filePath)
  const acceptEncoding = req.headers['accept-encoding'] || ''

  if (acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip'
    res.writeHead(200, headers)
    raw.pipe(zlib.createGzip()).pipe(res)
  } else {
    res.writeHead(200, headers)
    raw.pipe(res)
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`ze-reis rodando na porta ${PORT}`)
})
