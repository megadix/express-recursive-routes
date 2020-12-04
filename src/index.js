const assert = require('assert');
const routeScanner = require('./routeScanner');

module.exports.DEFAULT_ROOT_DIR = './routes';
module.exports.DEFAULT_BASE_PATH = '';
module.exports.DEFAULT_FILTER = '.js';

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
 * @param {String} [filter] Include files that match substring
 */
module.exports.mountRoutes = function (app,
                                       rootDir = module.exports.DEFAULT_ROOT_DIR,
                                       basePath = module.exports.DEFAULT_BASE_PATH,
                                       filter = module.exports.DEFAULT_FILTER) {
    assert(app, 'app parameter is null or undefined');
    const routes = routeScanner.scanRoutes(rootDir, basePath, filter);
    
    routes.forEach(route => {
        app.use(route.path, require(route.src));
    });
};
