const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 証明書ファイルのパス
const certDir = path.join(__dirname, 'certificates');
const httpsOptions = {
  key: fs.readFileSync(path.join(certDir, 'localhost.key')),
  cert: fs.readFileSync(path.join(certDir, 'localhost.crt')),
};

// ポート3001で起動
const port = parseInt(process.env.PORT || '3001', 10);

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> nico-calが起動しました: https://localhost:${port}`);
  });
});
