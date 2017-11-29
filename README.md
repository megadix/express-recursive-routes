# express-recursive-routes

Recursively configure Express.js routes in a folder

# Usage

```js
const routeUtils = require('express-recursive-routes');
routeUtils.mountRoutes(app, './my-routes-folder', '/api');
```

If your routes are under `./routes` directory and you want to map them directly under root path you can skip the 2nd and
3rd parameters:

```js
routeUtils.mountRoutes(app);
```

# Development

Commit using `commitizen`:

```
npm run commit
```