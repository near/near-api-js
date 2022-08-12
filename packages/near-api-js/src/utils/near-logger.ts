type LogEvent = (... args: any[]) => void;
type LogConfigurations = { showLogs?: BooleanEvent, onLog?: LogEvent; onWarn?: LogEvent; onInfo?: LogEvent; onError?: LogEvent };
type BooleanEvent = () => boolean;

class NearLogger {
    log: LogEvent;
    warn: LogEvent;
    info: LogEvent;
    error: LogEvent;
  
    showLogs: BooleanEvent;
  
    private static _logger?: NearLogger;

    private readonly defaultLog = console.log;
    private readonly defaultWarn = console.warn;
    private readonly defaultInfo = console.info;
    private readonly defaultError = console.error;

    private bindWithCondition(event: LogEvent): LogEvent {
        if (event) {
            return (... args: any[]) => {
                if (this.showLogs()) {
                    event(args);
                }
            };
        } else {
            return null;
        }
    }

    constructor() {
        this.reset();
    }

    configure({ showLogs, onLog, onWarn, onInfo, onError}: LogConfigurations) {
        this.showLogs = showLogs ?? this.showLogs;
        this.log = this.bindWithCondition(onLog) ?? this.log;
        this.warn = this.bindWithCondition(onWarn) ?? this.warn;
        this.info = this.bindWithCondition(onInfo) ?? this.info;
        this.error = this.bindWithCondition(onError) ?? this.error;
    }

    reset() {
        this.showLogs = () => !process.env?.['NEAR_NO_LOGS'];
        this.log = this.bindWithCondition(this.defaultLog);
        this.warn = this.bindWithCondition(this.defaultWarn);
        this.info = this.bindWithCondition(this.defaultInfo);
        this.error = this.bindWithCondition(this.defaultError);
    }

    static getSharedInstance(): NearLogger {
        if (!this._logger) {
            this._logger = new NearLogger();
        }
        return this._logger;
    }
}

const logger = NearLogger.getSharedInstance();

export const Logger = logger;

/**
 * To configure all near js api logs
 * 
 * @param configurations {@link LogConfigurations} 
 * with {
 * @prop {BooleanEvent} showLogs = () => boolean
 * @prop {LogEvent} onLog = (... args: any[]) => void
 * @prop {LogEvent} onWarn = (... args: any[]) => void
 * @prop {LogEvent} onInfo = (... args: any[]) => void
 * @prop {LogEvent} onError = (... args: any[]) => void
 * }
 */
export function configureLogging(configurations: LogConfigurations) {
    logger.configure(configurations);
}