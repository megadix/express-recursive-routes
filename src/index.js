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
 * @param {Object} app Express.js app object
 * @param {String} [rootDir]
 * @param {String} [basePath]
 * @param {String} filter Include files that match substring
 */
module.exports.mountRoutes = function (app, rootDir = './routes', basePath = '', filter = '.js') {

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

        const filename = path.basename(filePath);

        let filePathPart = filename;

        if (filename.indexOf(filter) < 0) {
            return;
        }

        // remove pattern from route path
        filePathPart = filePathPart.replace(filter, '');

        if (filePathPart.endsWith('.js')) {
            // remove trailing .js if the path matched start of the string
            filePathPart = filePathPart.substr(0, filePathPart.length - 3);
        }

        const isIndex = filePathPart.toLowerCase() === 'index';

        // combine path segments
        const routePath = `${basePath}${requestPath}/${isIndex ? '' : filePathPart}`;
        app.use(routePath, require(filePath));
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