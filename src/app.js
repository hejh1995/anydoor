const http = require('http');
const conf = require('./config/default')
const path = require('path');
const router = require('./helper/router');
const openURL = require('./helper/openURL');

class Server {
  constructor(config) {
    this.conf = Object.assign({}, conf, config)
  }
  start() {
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      // path.join 路径拼接
      router(req, res, filePath, this.conf);
    });

    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`
      console.log(`服务器运行在 ${addr}`)
      openURL(addr)
    })
  }
}
module.exports = Server;
