import React from 'react';
import { navigate } from "@reach/router"
import Loader from '../components/Loader';
import { Logger, UserRepository } from 'payonkjs';

import MagicProfileComponent from '../components/MagicProfileComponent';
import AccountProfileService from '../services/AccountProfileService';
import AuthService from '../services/AuthService';
import AuthenticationProfile from '../models/AuthenticationProfile';
import AccountProfile from '../models/AccountProfile';
import Layout from '../layout';


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
            alert: "Hello, stranger",
            accountProfile: accountProfile,
            authenticationProfile: authenticationProfile,
            status: 'initialized'
        }
        this.accountProfileService = AccountProfileService.getInstance();

        this.handleUserChange = this.handleUserChange.bind(this);
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

    async handleUserChange() {
        let authService = AuthService.getInstance();
        let isLoggedIn = await authService.isLoggedIn();
        debugger;
        if (isLoggedIn === false) {
            navigate('/login', { replace: true });
           this.setState({ authenticationProfile: null, isLoggedIn: isLoggedIn });
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
            <Layout>
                <div className="container main-content">
                    <div className="columns is-centered">
                        <div className="column is-three-fifths">
                            <h1>My Home</h1>
                            <h2>{this.state.alert}</h2>

                            <p>

                                Here is where authorized apps are displayed
                            </p>
                        </div>
                        <div className="column is-two-fifths">
                            <div style={{margin:"0px 0px 10px 0px"}} className="is-pulled-right">
                                {this.renderJWTWidget()}
                            </div>
                        <MagicProfileComponent
                                emailAddress={accountProfile.emailAddress}
                                publicAddress={authenticationProfile.publicAddress}
                                didToken={authenticationProfile.didToken}
                                onLogout={this.handleUserChange}
                            />
                        </div>

                    </div>
                    <div className="columns has-text-centered">
                    </div>
                </div>
            </Layout>
        );
    }
}

export default UserHomeIndex;