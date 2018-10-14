const path = require('path');
const mineTypes = {
  'css': {
    text: 'text/css',
    icon: 'css'
  },
  'gif': {
    text: 'image/gif',
    icon: 'gif'
  },
  'html': {
    text: 'text/html',
    icon: 'html'
  },
  'js': {
    text: 'text/javascript',
    icon: 'js'
  },
  'json': {
    text: 'application/json',
    icon: 'icon'
  },
  'txt': {
    text: 'text/plain',
    icon: 'txt'
  }
};
module.exports = (filePath) => {
  let ext = path.extname(filePath).split('.').pop();
  if (!ext) ext = filePath;
  // || 第一项不为空，返回第一项，第一项为空，返回第二项
  return mineTypes[ext] || mineTypes['txt'];
}
