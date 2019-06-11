const logLevelName = process.env.EXPRESS_RECURSIVE_ROUTES_LOG_LEVEL || null;

let logLevel = 3;

const LOG_LEVEL_ERROR = 0;
const LOG_LEVEL_WARN = 1;
const LOG_LEVEL_INFO = 2;
const LOG_LEVEL_DEBUG = 3;

switch (logLevelName) {
  case 'ERROR':
    logLevel = LOG_LEVEL_ERROR;
    break;
  case 'WARN':
    logLevel = LOG_LEVEL_WARN;
    break;
  case 'INFO':
    logLevel = LOG_LEVEL_INFO;
    break;
  case 'DEBUG':
    logLevel = LOG_LEVEL_DEBUG;
    break;
  default:
    logLevel = LOG_LEVEL_WARN;
}

module.exports.debug = (msg) => {
  if (logLevel >= LOG_LEVEL_DEBUG) {
    console.debug(msg);
  }
};

module.exports.info = (msg) => {
  if (logLevel >= LOG_LEVEL_INFO) {
    console.info(msg);
  }
};

module.exports.warn = (msg) => {
  if (logLevel >= LOG_LEVEL_WARN) {
    console.warn(msg);
  }
};

module.exports.crit = (msg) => {
  if (logLevel >= LOG_LEVEL_WARN) {
    console.error(msg);
  }
};