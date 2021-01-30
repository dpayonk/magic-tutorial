import React from 'react';
import { navigate } from "@reach/router"
import Loader from '../components/Loader';
import { Logger, UserRepository } from 'payonkjs';

import MagicProfileComponent from '../components/MagicProfileComponent';
import AccountProfileService from '../services/AccountProfileService';
import AuthService from '../services/AuthService';
import AuthenticationProfile from '../models/AuthenticationProfile';
import AccountProfile from '../models/AccountProfile';


class UserHomeIndex extends React.Component {

    constructor(props) {
        super(props);
        let emailAddress = UserRepository.getEmailAddress();
        let didToken = UserRepository.getDidToken();
        let accountProfile = null;
        let authenticationProfile = null;

        if (emailAddress !== '' && didToken != '') {
            // bootstrapping account from Local data first if available
            // should include JWT token
            accountProfile = new AccountProfile();
            accountProfile.emailAddress = emailAddress;
            accountProfile.didToken = didToken;

            authenticationProfile = new AuthenticationProfile(
                accountProfile.emailAddress,
                accountProfile.didToken);
        }

        this.state = {
            alert: "Hello, your name here",
            accountProfile: accountProfile,
            authenticationProfile: authenticationProfile,
            status: 'initialized'
        }
        this.accountProfileService = AccountProfileService.getInstance();


        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    async componentDidMount() {
        let accountProfile = await this.accountProfileService.fetchMyProfile();

        if (accountProfile !== null) {
            this.setState({ status: 'mounted', accountProfile: accountProfile });
        } else {
            this.setState({ status: 'mounted', alert: 'An error occurred fetching profile' });
        }
    }

    async handleStateChange(){
        debugger;
        let authService = AuthService.getInstance();
        if (authService.isLoggedIn() === false){
            this.setState({authenticationProfile: null});
            navigate('/login', { replace: true });
        }
    }

    async handleRefresh() {

        if (this.state.authenticationProfile !== null) {
            let profileService = AccountProfileService.getInstance();
            let accountProfile = await profileService.createProfile(this.state.authenticationProfile);
            this.setState({ accountProfile: accountProfile });
        } else {
            alert("Authentication Profile is null.  You're going to need to reauthenticate!");
        }
    }

    renderJWTWidget() {
        let jwtToken = UserRepository.getJWT();
        if (jwtToken === null || jwtToken === "") {
            return (<div>
                <button onClick={this.handleRefresh} className="button is-secondary">
                    Create Profile
                </button>
            </div>);
        } else {
            return (<div>
                <button onClick={this.handleRefresh} className="button is-secondary">
                    Refresh Session
                </button>
            </div>);
        }
        return (<div>Session expires in</div>);
    }


    render() {
        if (this.state.status !== 'mounted') {
            return (<Loader title='Loading Home' />);
        }
        if (this.state.accountProfile === null) {
            return (<div>There is no homepage to load</div>);
        }

        const accountProfile = this.state.accountProfile;
        const authenticationProfile = this.state.authenticationProfile;

        return (
            <div className="container main-content">
                <div className="columns is-centered has-text-centered">
                    <div className="column is-four-fifths">
                        <h1>My Profile</h1>
                        <h2>{this.state.alert}</h2>
                        <MagicProfileComponent
                            emailAddress={accountProfile.emailAddress}
                            publicAddress={authenticationProfile.publicAddress}
                            didToken={authenticationProfile.didToken}
                            onChange={this.handleStateChange}
                        />
                    </div>
                    <div className="column is-one-fifths">
                        {this.renderJWTWidget()}
                        Here is where authorized apps are displayed
</div>

                </div>
                <div className="columns has-text-centered">
                </div>
            </div>
        );
    }
}

export default UserHomeIndex;