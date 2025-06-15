import { Request } from "express";

import morgan from "morgan";
import winston from "winston";

// logger config
const logFormat = winston.format.combine(
  winston.format.colorize({ all: false }),
  winston.format.printf((info) => {
    return `${info.level}: ${info.message}`;
  })
);

winston.addColors({
  debug: "green",
  error: "red",
  info: "cyan",
  silly: "magenta",
  warn: "yellow",
});

let logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [new winston.transports.Console()],
});

//  update logger format from the queue processor to attach the requestId for searching

function updateLoggerNamespace(requestId: any) {
  const newLoggerFormat = winston.format.combine(
    winston.format.colorize({ all: false }),
    winston.format.printf((info) => {
      //  retrieve requestId from queue procesor  for each log entry
      const reqId = requestId || "-";
      return `[${reqId}] ${info.level}: ${info.message}`;
    })
  );
  logger = winston.createLogger({
    level: "info",
    format: newLoggerFormat,
    transports: [new winston.transports.Console()],
  });
}

// set custom tokens for logging
morgan.token("req-details", (req: Request) => {
  return JSON.stringify({
    headers: req.headers,
    body: req.body, // commeting out to suppress the log size
    query: req.query,
    params: req.params,
  });
});

morgan.token("real-ip", (req: Request) => {
  return req.get("x-real-ip") || "";
});

morgan.token("spawn-id", (req: Request) => {
  return req.get("spawn-id") || "";
});

morgan.token("origin-ip", (req: Request) => {
  return req.get("origin-ip") || "";
});

// success stream
const successStream = {
  write: (message) => logger.info(message),
};

// error stream
const errorStream = {
  write: (message) => logger.error(message),
};

const formatVerbose =
  ":real-ip :spawn-id :origin-ip :remote-user :method :url HTTP/:http-version - :status :res[content-type] :res[content-length] - :response-time ms REQUEST_DETAILS - :req-details";

const accessErrorLogger: any = morgan(formatVerbose, {
  skip: (req, res) => res.statusCode < 400,
  stream: errorStream,
});

const accessSuccessLogger: any = morgan(formatVerbose, {
  skip: (req, res) => res.statusCode >= 400,
  stream: successStream,
});

export {
  logger,
  accessSuccessLogger,
  accessErrorLogger,
  updateLoggerNamespace,
};
