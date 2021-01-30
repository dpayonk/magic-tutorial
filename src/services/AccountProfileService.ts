import {
  Logger,
  BaseService,
  ISerializableObject,
  IParsedResponse,
  UserRepository,
} from "payonkjs";

import AccountProfile from "../models/AccountProfile";
import AuthenticationProfile from "../models/AuthenticationProfile";
import Configuration from "../Configuration";

class AccountProfileService extends BaseService {
  static SINGLETON: AccountProfileService;

  static getInstance(): AccountProfileService {
    if (this.SINGLETON !== undefined) {
      return this.SINGLETON;
    } else {
      this.SINGLETON = new AccountProfileService(Configuration.BACKEND_URL);
      return this.SINGLETON;
    }
  }

  endpoints() {
    const apiUrl = this.baseUrl;
    return {
      authorizedRouteUrl: { url: `${apiUrl}/user/authorized` },
      myProfileRouteUrl: { url: `${apiUrl}/user/me` },
      createProfileRouteUrl: { url: `${apiUrl}/profile/create` },
    };
  }

  async apiPost(remoteUrl: string, requestSchema: any, responseObject:any): Promise<IParsedResponse>{
    debugger;
    return await super.apiPost(remoteUrl, requestSchema, responseObject);
  }

  generateHeaders() : Record<string, string> {
    let originalResult = super.generateHeaders();

    // Logger.debug('Overwrite headers');
    let jwtToken = UserRepository.getJWT();
    
    if (jwtToken !== null && jwtToken !== "") {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      };
    }
    Logger.info('JWT tokens are not currently present', jwtToken);
    return {
      'Content-Type': 'application/json'
    }
  }

  async createProfile(
    authenticationProfile: AuthenticationProfile
  ): Promise<ISerializableObject | null> {
    // public_address: authenticationProfile.publicAddress,
    // issuer: authenticationProfile.issuer
    let createProfileRequestSchema = {
      email_address: authenticationProfile.emailAddress,
      did_token: authenticationProfile.didToken,
      issuer: authenticationProfile.issuer,
    };
    try {
      debugger;
      let { ok, model, data, errors } = await this.apiPost(
        this.endpoints().createProfileRouteUrl.url,
        createProfileRequestSchema,
        AccountProfile
      );

      if (ok && errors === "") {
        if (data.jwt_token !== undefined) {
          Logger.alert(`A new JWT token was issued`, data.jwt_token);
          UserRepository.publishJWT(data.jwt_token);
        }
        return model;
      }
    } catch (error) {
      Logger.error(`An exception occured creating profile`, error);
    }
    return null;
  }

  // could help with context (know who you are) vs. regular rest call
  async fetchMyProfile(): Promise<AccountProfile | null> {
    try {
      // this should almost always have a jwt token
      let { ok, model, errors } = await this.apiGet(
        this.endpoints().myProfileRouteUrl.url,
        { permission: "my_profile" },
        AccountProfile
      );

      if (ok && errors === "") {
        return model as AccountProfile;
      } else {
        Logger.warn(
          "AccountProfileService.fetchMyProfile: Permission error",
          errors
        );
        // This is mostly a permission error
      }
    } catch (error) {
      Logger.error(
        `AccountProfileService.fetchMyProfile: Exception in BaseService`,
        error
      );
      return null;
    }
    return null;
  }

  async fetchAuthorizationStatus(
    emailAddress: string,
    permissionName: string
  ): Promise<boolean> {
    let variables = {
      email_address: emailAddress,
      permissionName: permissionName,
    };
    if (this.hasJWT() === false) {
      Logger.alert("No token present.  A profile needs to be created.", null);
      return false;
    }

    Logger.info(
      `Checking permission ${permissionName} for email:`,
      emailAddress
    );
    try {
      let response = await fetch(this.endpoints().authorizedRouteUrl.url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: this.generateHeaders(),
        body: JSON.stringify(variables),
      });

      let jsonResponse = await response.json();
      Logger.info(`AuthService.getAuthorizationProfile:`, jsonResponse);
      if (jsonResponse.data === undefined) {
        throw new Error("Invalid Schema Response.  No data element defined");
      }

      // responseSchema = {data: {authenticated: bool, authorized: bool}, errors: string}
      let data = jsonResponse.data;

      if (jsonResponse.errors === "") {
        if (data.authorized !== undefined || data.authorized !== null) {
          return data.authorized;
        }
      } else {
        Logger.error(
          "AccountProfileService.fetchAuthorizationStatus: Error in response",
          jsonResponse.errors
        );
      }
    } catch (error) {
      Logger.error(
        "An exception occurred trying to obtain authorization",
        error
      );
      // may need to set serverHealth to false
    }
    return false; // only returns true on happy path
  }
}

export default AccountProfileService;
