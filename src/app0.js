const http = require('http');
const conf = require('./config/default')
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url);
  // path.join 路径拼接
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`${filePath} is not a directory or file`);
      return;
    }
    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      // 把文件内容以流的形式读出来，传给res。
      fs.createReadStream(filePath).pipe(res);
    } else if (stats.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        // 读取目录
        if (err) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('errorr');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(files.join(','));
      })
    }
  })
});

server.listen(conf.port, conf.hostname, () => {
  console.log(`服务器运行在 http://${conf.hostname}:${conf.port}`)
})
