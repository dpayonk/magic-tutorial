

class Logger{
    static debug: (message: any, obj: any) => void;
    static info: (message: any, obj: any) => void;
    static alert: (message: any, obj: any) => void;
    static warn: (message: any, obj: any) => void;
    static error: (message: any, exc: any) => void;
    static redirectTo: (arr: any) => void;
    static output: any;
    static publishEvent: (eventKey: any, props: any) => any;
    static subscribe: (eventKey: any, callback: any) => void;
    static SUBSCRIBERS: any;

    constructor(){
        //console.log("Use Static Functions please");
    }

    debug(message: string, obj: any){
        Logger.debug(message, obj);
    }

    info(message: string, obj: any){
        Logger.info(message, obj);
    }

    warn(message: string, obj: any){
        Logger.warn(message, obj);
    }

    alert(message: string, obj: any){
        Logger.alert(message, obj);
    }

    error(message: string, obj: any){
        Logger.error(message, obj);
    }

}

Logger.output = 'console';


Logger.debug = function(message, obj){
    if(obj !== undefined){
        console.debug(message, obj)
    } else {
        console.debug(message);
    }
    Logger.publishEvent('debug',{message: message, obj: obj});
}


Logger.alert = function(message, obj){
    if(obj !== undefined){
        console.log(message, obj)
    } else {
        console.log(message);
    }
    Logger.publishEvent('alert',{message: message, obj: obj});
}


Logger.info = function(message, obj){
    if(obj !== undefined){
        console.log(message, obj)
    } else {
        console.log(message);
    }
    Logger.publishEvent('info',{message: message, obj: obj});
}

/* Dangerous because of infinite loop */
Logger.warn = function(message, obj){
    if(obj !== undefined){
        console.warn(message, obj)
    } else {
        console.warn(message);
    }
    Logger.publishEvent('warn',{message: message, obj: obj});
}

Logger.error = function(message, exc){
    console.error(message, exc);
}

Logger.redirectTo = function(arr){
    Logger.output = arr;
}

Logger.subscribe = function (eventKey, callback) {
    Logger.SUBSCRIBERS = Logger.SUBSCRIBERS || {};

    if (Logger.SUBSCRIBERS[eventKey] !== undefined) {
        Logger.SUBSCRIBERS[eventKey].push(callback);
    } else {
        Logger.SUBSCRIBERS[eventKey] = [];
        Logger.SUBSCRIBERS[eventKey].push(callback);
    }
}

Logger.publishEvent = function (eventKey, props) {

    if (Logger.SUBSCRIBERS === undefined) {
       console.log(`Initializing Logging subscribers`);
       Logger.SUBSCRIBERS = Logger.SUBSCRIBERS || {};
    }

    if (Logger.SUBSCRIBERS[eventKey] !== undefined) {
        Logger.SUBSCRIBERS[eventKey].forEach(function (callbackFunction: any, index: number) {
            try {
                let result = callbackFunction(props);
                Logger.info('Completed publish callback', result);
            } catch (error) {
                Logger.error(`A subscriber to user updates failed:`, error);
            }
        });
    } else {
        Logger.SUBSCRIBERS[eventKey] = [];
    }
    return Logger.SUBSCRIBERS[eventKey].length;
}


export default Logger