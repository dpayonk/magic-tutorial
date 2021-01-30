class AuthenticationProfile {
    /*
    [Reference](https://docs.magic.link/client-sdk/web/api-reference)
    */
    emailAddress: string;
    didToken: string;
    issuer: string = "";
    publicAddress: string = "";

    constructor(emailAddress: string, didToken: string) {
        this.emailAddress = emailAddress;
        this.didToken = didToken;
    }

    getFriendlyName() {
        if (this.emailAddress !== undefined && this.emailAddress !== null){
            return this.emailAddress.split('@')[0];
        } else {
            return 'Stranger';
        }
    }
}


export default AuthenticationProfile;