import Logger from './Logger';
import UserRepository from '../repository/UserRepository';
import { ISerializableObject, IParsedResponse } from './BaseInterfaces';


class BaseService {
  baseUrl: string;
  // jwtToken: string = "";

  constructor(url: string) {
    this.baseUrl = url;
  }

  hasJWT(): boolean {
    return (UserRepository.getJWT() !== "");
  }

  endpoints(): any {
    const apiUrl = this.baseUrl;
    return {
      'authorizedRouteUrl': { url: `${apiUrl}/account/authorized`, params: {} },
      'createProfileRouteUrl': { url: `${apiUrl}/account/create`, params: {} },
      'myProfileRouteUrl': { url: `${apiUrl}/account/me`, params: {} }
    }
  }

  generateHeaders() : Record<string, string> {
    let jwtToken = UserRepository.getJWT();
    if (jwtToken !== null && jwtToken !== "") {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      };
    }
    Logger.debug('JWT tokens are not currently present', null);
    return {
      'Content-Type': 'application/json'
    }
  }

  async getHealth() {
    // Convention to check health of backend server
    let healthUrl = `${this.baseUrl}/health`;
    try{
      let response = await fetch(healthUrl, {
        method: 'GET', mode: 'cors', cache: 'no-cache',
        headers: this.generateHeaders()
      });
      return response.ok;        
    }catch(exc){
      return false;
    }
  }

  async apiPost(remoteUrl: string, requestSchema: any, responseObjectType: any): Promise<IParsedResponse> {
    // let newAuthenticationProfile = await post('/profile', inputObject, outputType)
    // this.generateHeaders()
    // responseObjectType must implement an interface
    // that has a fromJson() method that returns the object
    let rawData = null;
    let response = await fetch(remoteUrl, {
      method: 'POST', mode: 'cors', cache: 'no-cache',
      headers: {},
      body: JSON.stringify(requestSchema)
    });
    let jsonResponse = await response.json();

    if (jsonResponse.data === undefined) {
      Logger.info(`BaseService returned invalid schema result`, jsonResponse);
    } else {
      rawData = jsonResponse.data;
      Logger.info(`BaseService parsing raw data`, rawData);
    }
    let responseObject = responseObjectType.fromJson(jsonResponse.data);
    // Use responseObjectType.fromJson()
    // check schema response

    let errors = "";
    return {
      'ok': response.ok,
      'model': responseObject,
      'data': rawData,
      'errors': errors
    }
  }

  async apiGet(remoteUrl: string, requestSchema: any,
    responseObjectType: ISerializableObject): Promise<IParsedResponse> {
    // let newAuthenticationProfile = await post('/profile', inputObject, outputType)
    // this.generateHeaders()
    // responseObjectType must implement an interface
    // that has a fromJson() method that returns the object
    var queryString = Object.keys(requestSchema).map(key => key + '=' + requestSchema[key]).join('&');
    let urlWithData = remoteUrl + "?" + queryString;
    let errorMessage = '';
    let response = await fetch(urlWithData, {
      method: 'GET', mode: 'cors', cache: 'no-cache',
      headers: this.generateHeaders()
    });
    let jsonResponse = await response.json();
    let rawData = null;

    if (jsonResponse.data === undefined) {
      errorMessage = `BaseService returned invalid schema result`
      Logger.info(errorMessage, jsonResponse);
    } else {
      rawData = jsonResponse.data;
      Logger.info(`BaseService parsing raw data`, rawData);
    }
    let responseObject = responseObjectType.fromJson(jsonResponse.data);
    debugger;
    // Use responseObjectType.fromJson()
    // check schema response

    return {
      'ok': response.ok,
      'model': responseObject,
      'data': rawData,
      'errors': errorMessage
    }
  }
}


export default BaseService