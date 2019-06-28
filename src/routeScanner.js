const fs = require('fs');
const path = require('path');

const logger = require('./logger');

module.exports.scanRoutes = function(rootDir, basePath, filter) {
  rootDir = _stripTrailingSlash(rootDir);
  const normalizedRootDir = path.normalize(`${process.cwd()}${path.sep}${rootDir}`);
  basePath = _addLeadingSlash(_stripTrailingSlash(basePath));

  return mountDir(normalizedRootDir);

  function mountDir(dirPath) {
    logger.debug(`Mounting dir  = ${dirPath}`);

    let tempResult = [];

    fs.readdirSync(dirPath).forEach(filename => {
      const filePath = `${dirPath}${path.sep}${filename}`;
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        tempResult = tempResult.concat(mountDir(filePath));
      }
      else if (stat.isFile() && filename.toLowerCase().endsWith('.js')) {
        tempResult = tempResult.concat(mountFile(filePath));
      }
      else {
        throw Error(`Filename "${filePath}" is neither a file nor a directory`);
      }
    });

    return tempResult;
  }

  function mountFile(filePath) {
    logger.debug(`Mounting file = ${filePath}`);
    const dirname = path.dirname(filePath);
    const requestPath = (dirname.startsWith(normalizedRootDir) ? dirname.substr(normalizedRootDir.length) : dirname)
      .replace(/\\/g, '/'); // Windows-only

    const filename = path.basename(filePath);

    if (filename.indexOf(filter) < 0) {
      return [];
    }

    let filePathPart = filename;

    // remove pattern from route path
    filePathPart = filePathPart.replace(filter, '');

    if (filePathPart.endsWith('.js')) {
      // remove trailing .js if the path matched start of the string
      filePathPart = filePathPart.substr(0, filePathPart.length - 3);
    }

    const isIndex = filePathPart.toLowerCase() === 'index';

    // combine path segments
    const routePath = `${basePath}${requestPath}/${isIndex ? '' : filePathPart}`;

    return {
      path: routePath,
      src: filePath
    };
  }

};

function _cleanString(s) {
  if (!s) {
    return '';
  }
  return s.trim();
}

function _stripTrailingSlash(s) {
  s = _cleanString(s);
  return s.endsWith('/') ? s.substr(0, s.length - 1) : s;
}

function _addLeadingSlash(s) {
  s = _cleanString(s);
  return s.length > 0 && !s.startsWith('/') ? `/${s}` : s;
}
