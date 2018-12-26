var winston = require('winston');

module.exports = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/info.log' })
    ]
});