// @ts-nocheck
// [Reference Design](https://stackoverflow.com/questions/29758765/json-to-typescript-class-instance)
import Logger from "./Logger";


class SerializationMixin {
    static convertToCamelCase: (json_data: any) => any;
    static toCamel: (s: any) => any;
    //logger: Logger = new Logger();
    // [key: string]: string;
    fillFromJSON(jsonObj: Object) {
        // var jsonObj = JSON.parse(json);
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName]
        }
    }
}


SerializationMixin.toCamel = (s: any) : string =>{
    return s.replace(/([-_][a-z])/ig, ($1 : string) => {
        return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
    });
};

SerializationMixin.convertToCamelCase = (jsonData: any) => {
    let camelVersion: Record<string,any> = {};
    for (var key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            let camelCase = SerializationMixin.toCamel(key) as string;
            camelVersion[camelCase] = jsonData[key];
        }
    }
    return camelVersion;
}

export default SerializationMixin;