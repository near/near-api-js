import depd from 'depd';

let logger: Logger;

export const setLogLevel = (logLevel: LogLevel) => {
    if(!logger) setLogger(new DefaultLogger());
    logger.setLogLevel(logLevel);
};

export const getLogger = () => {
    if(!logger) setLogger(new DefaultLogger);
    return logger;
};

export const setLogger = (newLogger) => logger = newLogger;

export enum LogLevel {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  NONE = 5
}

/**
 * The Logger interface is used to specify how information is logged
 * @see {DefaultLogger}
 */
export interface Logger {
  setLogLevel(LogLevel): void;
  deprecate(moduleName: string, msg: string): void;
  debug(...msg: any[]): void;
  info(...msg: any[]): void;
  warn(...msg: any[]): void;
  error(...msg: any[]): void;
}

/**
 * The default logger uses console.* to log messages
 */
export class DefaultLogger implements Logger {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.WARN) {
      this.logLevel = logLevel;
  }

  setLogLevel(logLevel: LogLevel) {
      this.logLevel = logLevel;
  }

  deprecate(moduleName: string, msg: string) {
      if(this.shouldLog(LogLevel.ERROR)) {
          const deprecate = depd(moduleName);
          deprecate(msg);
      }
  }

  debug(...msg: any[]) {
      if(this.shouldLog(LogLevel.DEBUG)) {
          console.log(...msg);
      }
  }

  info(...msg: any[]) {
      if(this.shouldLog(LogLevel.INFO)) {
          console.log(...msg);
      }
  }

  warn(...msg: any[]) {
      if(this.shouldLog(LogLevel.WARN)) {
          console.warn(...msg);
      }
  }

  error(...msg: any[]) {
      if(this.shouldLog(LogLevel.ERROR)) {
          console.error(...msg);
      }
  }

  private shouldLog(level: LogLevel) {
      return this.logLevel <= level;
  }
}