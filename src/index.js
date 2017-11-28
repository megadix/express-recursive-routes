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

    const normalizedRootDir = path.normalize(`${process.cwd()}${path.sep}${rootDir}`);

    mountDir(normalizedRootDir);

    function mountDir(dirPath) {
        fs.readdirSync(dirPath).forEach(filename => {
            const filePath = `${dirPath}${path.sep}${filename}`;
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
        const requestPath = (dirname.startsWith(normalizedRootDir) ? dirname.substr(normalizedRootDir.length) : dirname)
        // Windows
            .replace('\\', '/');

        const filename = path.basename(filePath, '.js');
        const isIndex = filename.toLowerCase() === 'index';

        const routePath = `${basePath}${requestPath}/${isIndex ? '' : filename}`;
        app.use(routePath, require(filePath));
    }

};

