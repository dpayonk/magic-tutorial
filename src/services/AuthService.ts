import { Magic } from "magic-sdk";
import { Logger, StateStore, UserRepository } from "payonkjs";
import AuthenticationProfile from "../models/AuthenticationProfile";
import Configuration from "../Configuration";

class AuthService {
  static SINGLETON: AuthService;
  static getInstance(): AuthService {
    if (this.SINGLETON !== undefined) {
      return this.SINGLETON;
    } else {
      this.SINGLETON = new AuthService();
      return this.SINGLETON;
    }
  }

  getMagicFactory() {
    // wrapped this in order to make server side NodeJS compilation work with Gatsby
    return new Magic(Configuration.MAGIC_PUBLISHABLE_KEY);
  }

  async isLoggedIn() {
    const isLoggedIn = await this.getMagicFactory().user.isLoggedIn();
    Logger.info(`AuthService.isLoggedIn():`, isLoggedIn);
    return isLoggedIn;
  }

  async logout() {
    let m = this.getMagicFactory();
    m.user.logout();
    // remove from localStorage as well
    UserRepository.clearAll();
  }

  async loginMagic(emailAddress: string) {
    // Method to start authentication,
    UserRepository.storeEmail(emailAddress);
    let didToken = await this.getMagicFactory().auth.loginWithMagicLink({
      email: emailAddress,
      showUI: true,
      redirectURI: this.getRedirectUri(),
    });

    // this didToken is only valid for 15 minutes
    // need to call fetchAuthenticationProfile to get a longer lifespan
    // token
    if (didToken !== null) {
      this.saveAuthentication(didToken);
    }
  }

  async handleMagicAuthenticationRedirect(): Promise<AuthenticationProfile | null> {
    // Method called by redirect (from app.js)
    let didToken = await this.getMagicFactory().auth.loginWithCredential();
    if (didToken !== null) {
      let authenticationProfile = await this.saveAuthentication(didToken);
      return authenticationProfile;
    }
    return null;
  }

  // Move to AccountProfileService
  async saveAuthentication(
    didToken: string
  ): Promise<AuthenticationProfile | null> {
    UserRepository.storeKey("didToken", didToken);
    UserRepository.storeKey("updatedAt", new Date().toISOString());
    let subscribers = StateStore.publishEvent("onLogin", {
      didToken: didToken,
    });
    Logger.info(`Subscribers notified:`, subscribers);
    let emailAddress = UserRepository.getEmailAddress();
    if (emailAddress !== null) {
      return new AuthenticationProfile(emailAddress, didToken);
    } else {
      return null;
    }
  }

  getRedirectUri() {
    const appUrl = Configuration.AUTH_CALLBACK_ROUTE;
    return `${window.location.protocol}//${window.location.host}${appUrl}`;
  }

  async getAuthenticationProfile(): Promise<AuthenticationProfile | null> {
    if (await this.isLoggedIn()) {
      try {
        const {
          issuer,
          email,
          publicAddress,
        } = await this.getMagicFactory().user.getMetadata();

        // IMPORTANT: this will refresh the didToken
        // which is used to authenticate a user
        const didToken = await this.getMagicFactory().user.getIdToken();
        Logger.info('Did Token Update', didToken);
        // this needs to be wrapped in a singleton or communicate among tabs
        // let newDidToken = await this.getMagicFactory().user.getIdToken({
        //   lifespan: 999999999999999,
        // });

        if (email !== null && issuer !== null && publicAddress !== null) {
          let authProfile = new AuthenticationProfile(email, didToken);
          authProfile.issuer = issuer;
          authProfile.publicAddress = publicAddress;
          return authProfile;
        }
      } catch (error) {
        Logger.error(
          `Auth service had a problem getting magic metadata`,
          error
        );
      }
    }
    return null;
  }
}

export default AuthService;
