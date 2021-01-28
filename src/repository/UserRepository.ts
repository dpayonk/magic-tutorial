import Logger from "../base/Logger";
import AccountProfile from "../models/AccountProfile";
import AuthenticationProfile from "../magic/AuthenticationProfile";
// import StateStore from '../StateStore';

class UserRepository {
  static SUBSCRIBERS: any;
  static storeKey(key: string, val: string) {
    if (typeof window === `undefined`) {
      console.log("NOOP, for gatsby");
    } else {
      window.localStorage.setItem(key, val);
    }
  }

  static getDidToken() {
    const didToken =
      typeof window === `undefined`
        ? null
        : window.localStorage.getItem("didToken");
    return didToken;
  }
  static getJWT() {
    const jwtToken =
      typeof window === `undefined`
        ? null
        : window.localStorage.getItem("jwtToken");
    if (jwtToken === undefined) {
      return null;
    }
    return jwtToken;
  }
  static storeEmail(emailAddress: string) {
    // if it exists, should throw a warning
    // required for gatsby: https://www.gatsbyjs.com/docs/debugging-html-builds/
    if (typeof window === `undefined`) {
      console.log("NOOP, for gatsby");
    } else {
      UserRepository.storeKey("emailAddress", emailAddress);
    }
  }
  static getEmailAddress(): string | null {
    const emailAddress =
      typeof window === `undefined`
        ? null
        : window.localStorage.getItem("emailAddress");
    return emailAddress;
  };
  
  static loadUserSessionFromStorage: () => any;

  static publishLogin(emailAddress: string, didToken: string) {
    console.log(`Email: ${emailAddress}, Token: ${didToken}`);
    debugger;
  }

  static onUpdate(callback: any) {
    UserRepository.SUBSCRIBERS = UserRepository.SUBSCRIBERS || [];
    UserRepository.SUBSCRIBERS.push(callback);
  }

  static storeJWT(jwtToken: string) {
    if (typeof window === `undefined`) {
      console.log("NOOP, for gatsby");
    } else {
      UserRepository.storeKey("jwtToken", jwtToken);
    }
  }

  static clearAll() {
    if (typeof window === `undefined`) {
      console.log("NOOP, for gatsby");
    } else {
      UserRepository.clearAuthentication();
      window.localStorage.removeItem("jwtToken");
    }
  }

  static publishJWT(jwtToken: string) {
    Logger.info(`New JWT token saved!`, jwtToken);
    UserRepository.storeJWT(jwtToken);
  };

  static clearAuthentication() {
    if (typeof window === `undefined`) {
      console.log("NOOP, for gatsby");
    } else {
      window.localStorage.removeItem("emailAddress");
      window.localStorage.removeItem("publicAddress");
      window.localStorage.removeItem("didToken");
    }
  };
}

// UserRepository.onSessionUpdate = function(callback){
//     StateStore.subscribe('session:update', callback);
// }
// UserRepository.publishNewSession = function(userSession){
//     StateStore.publishEvent('session:update', userSession);
// }

export default UserRepository;
