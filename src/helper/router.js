// 文件路径
const fs = require('fs');
const promisify = require('util').promisify;
// 利用 promisify 可以减少一些回调
const stat = promisify(fs.stat);
// fs.stat 获取文件信息
const readdir = promisify(fs.readdir);
// fs.readdir 读取文件目录
const Handlebars = require('handlebars');
// 用于对html文件的拼接
const path = require('path');
const tplpath = path.join(__dirname, '../template/dir.tpl');
// __dirname 当前文件所在的‘目录’的绝对路径
// 只有在require的时候使用相对路径，其他的时候最好使用相对路径
// 同步读取数据
const source = fs.readFileSync(tplpath);
// fs 默认读出的文件是buffer， 所以 source.toString() 强制转换
// 用 Handlebars 模块的compile 方法把html编译一下。
const template = Handlebars.compile(source.toString());
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./catch.js')
module.exports = async function(req, res, filePath, conf) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mime(filePath);
      res.setHeader('Content-Type', contentType.text);
      // 把文件内容以流的形式读出来，传给res。 fs.createReadStream(filePath).pipe(res)

      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs
      const { code, start, end } = range(stats.size, req, res);
      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, start, end);
      }
      if (filePath.match(conf.compress)) {
        rs = compress(res, req, rs);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const dir = path.relative(conf.root, filePath);
      const data = {
        title: path.basename(filePath),
        // path.basename 返回路径中的最后一部分。
        // /${dir} 表示跟路径
        dir: dir ? `/${dir}` : '',
        files: files.map(file => {
          return {
            file,
            // 当属性和值名称相同时，可以简写为上面的形式
            icon: mime(file).icon
          }
        })
      };
      res.end(template(data));
    }
  } catch (ex) {
    console.log('error', ex)
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a directory or file`);
    return;
  }
}
