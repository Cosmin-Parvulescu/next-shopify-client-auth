import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  transports: [
    new transports.Console(),
  ],
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
});

export default logger;
