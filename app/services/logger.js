const logger = require('winston');
const fs = require('fs');

// make sure that logs folder exists
const LOG_FOLDER_PATH = './logs';

if (!fs.existsSync(LOG_FOLDER_PATH)) {
  fs.mkdirSync(LOG_FOLDER_PATH);
}

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true,
});
logger.add(logger.transports.File, {
  filename: './logs/combined.log',
  maxsize: '2000000',
  maxFiles: '5',
  timestamp: true,
  json: false,
});
logger.level = 'debug';

exports.getLogger = () => logger;
