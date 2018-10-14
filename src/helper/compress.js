// 压缩
const { createGzip, createDeflate } = require('zlib');
module.exports = (res, req, rs) => {
  const acceptEncoding = req.headers['accept-encoding'];
  if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
    return rs;
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    // \b 字符的位置是非常重要的。如果它位于要匹配的字符串的开始，它在单词的开始处查找匹配项。如果它位于字符串的结尾，它在单词的结尾处查找匹配项。
    res.setHeader('Content-Encoding', 'gzip');
    return rs.pipe(createGzip());
  } else if (acceptEncoding.match(/\bdeflate\b/)) {
    res.setHeader('Content-Encoding', 'deflate');
    return rs.pipe(createDeflate());
  }
}
