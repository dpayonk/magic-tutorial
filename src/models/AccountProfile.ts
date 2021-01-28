import {ISerializableObject} from '../base/BaseInterfaces';
import SerializationMixin from '../base/BaseMixins';

import Logger from '../base/Logger';


class AccountProfile extends SerializationMixin implements ISerializableObject {
    key: string = "";
    createdAt: string = "";
    emailAddress: string = ""; // need to define default to implement hydrate
    currentRole: string = "";
    friendlyName: string = "Guest";

    
    static validateJsonResponse: (json_data: any) => boolean;
    static fromJson: (jsonResponse: any) => AccountProfile | null;

    constructor(props: Object = {}) {
        super();
        this.fillFromJSON(props);            
        debugger;     
        // TODO: Fix this  // AccountProfile.hydrate(props);
    }
    
    greet() {
        return "Hello, " + this.emailAddress;
    }

    toJson(){
        return {
            'emailAddress': this.emailAddress,      
            'currentRole': this.currentRole      
        }
    }

    fromJson(jsonResponse: any){
        return AccountProfile.fromJson(jsonResponse);
    }
}


AccountProfile.validateJsonResponse = function(json_data): boolean{
    // test all required values are populated    
    if(json_data['email_address'] !== undefined){
        return true;
    }

    return false;
}


AccountProfile.fromJson = function(jsonResponse: Object): AccountProfile | null {
    try{
        debugger;
        if(AccountProfile.validateJsonResponse(jsonResponse)){
            let jsonData = AccountProfile.convertToCamelCase(jsonResponse);
            return new AccountProfile(jsonData); 
        }
    }catch(exc){
        Logger.alert('AccountProfile.fromJson: Could not serialize response:', jsonResponse);
    }
    
    return null;
}

export default AccountProfile;