module.exports = {
  root: process.cwd(),
  // process.cwd() 当前进程的工作目录，也就是打开node时所在的位置
  hostname: '127.0.0.1',
  port: '3000',
  compress: /\.(html|js|css|md)/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
}
