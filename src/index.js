const fs = require('fs');
const path = require('path');

/**
 * Recursively mount all routes.
 *
 * @example
 * mountRoutes(app, './my-routes-folder', '/api');
 *
 * @example
 * // defaults to
 * // rootDir = './routes'
 * // basePath = ''
 * mountRoutes(app);
 *
 * @param app Express.js app object
 * @param rootDir
 * @param basePath
 */
module.exports.mountRoutes = function (app, rootDir = './routes', basePath = '') {

    rootDir = _stripTrailingSlash(rootDir);
    const normalizedRootDir = path.normalize(`${process.cwd()}${path.sep}${rootDir}`);

    basePath = _addLeadingSlash(_stripTrailingSlash(basePath));

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
            .replace('\\', '/'); // Windows-only

        const filename = path.basename(filePath, '.js');
        const isIndex = filename.toLowerCase() === 'index';

        const routePath = `${basePath}${requestPath}/${isIndex ? '' : filename}`;
        app.use(routePath, require(filePath));
    }

};

function _cleanString(s) {
    if (!s) {
        return s;
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