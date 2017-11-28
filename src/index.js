const fs = require('fs');
const path = require('path');

/**
 * Recursively mount all routes.
 *
 * @param app Express.js app object
 * @param rootDir
 * @param basePath
 */
module.exports.mountRoutes = function (app, rootDir = './routes', basePath = '') {

    mountDir(rootDir);

    function mountDir(dirPath) {
        fs.readdirSync(dirPath).forEach(filename => {
            const filePath = `${dirPath}/${filename}`;
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                mountDir(filePath);
            }
            else if (stat.isFile() && filename.endsWith('.js')) {
                mountFile(filePath);
            }
        });
    }

    function mountFile(filePath) {
        const dirname = path.dirname(filePath);
        const requestPath = dirname.startsWith(rootDir) ? dirname.substr(rootDir.length) : dirname;

        const filename = path.basename(filePath, '.js');
        const isIndex = filename.toLowerCase() === 'index';

        const routePath = `${basePath}${requestPath}/${isIndex ? '' : filename}`;
        app.use(routePath, require(filePath));
    }

};

