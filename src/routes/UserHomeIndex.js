import React from 'react';
import Loader from '../components/Loader';
import MagicProfileComponent from '../magic/MagicProfileComponent';
import AccountProfileService from '../services/AccountProfileService';
import UserRepository from '../repository/UserRepository';
import AuthenticationProfile from '../magic/AuthenticationProfile';
import AccountProfile from '../models/AccountProfile';


class UserHomeIndex extends React.Component {

    constructor(props) {
        super(props);

        let emailAddress = UserRepository.getEmailAddress();
        let didToken = UserRepository.getDidToken();
        let accountProfile = null;

        if (emailAddress !== '' && didToken != '') {
            // bootstrapping account from Local data first if available
            // should include JWT token
            accountProfile = new AccountProfile();
            accountProfile.emailAddress = emailAddress;
            accountProfile.didToken = didToken;
        }

        this.state = {
            alert: "Hello, your name here",
            accountProfile: accountProfile,
            status: 'initialized'
        }
        this.accountProfileService = AccountProfileService.getInstance();



        this.handleRefresh = this.handleRefresh.bind(this);
    }

    async componentDidMount() {
        let accountProfile = await this.accountProfileService.fetchMyProfile();
        debugger;
        if(accountProfile !== null){
            this.setState({ status: 'mounted', accountProfile: accountProfile });
        } else {
            this.setState({ status: 'mounted', alert: 'An error occurred fetching profile'});
        }
    }

    async handleRefresh() {

        debugger;
        if (this.state.accountProfile !== null) {
            debugger;
            let authenticationProfile = new AuthenticationProfile(
                this.state.accountProfile.emailAddress,
                this.state.accountProfile.didToken);
            let profileService = AccountProfileService.getInstance();
            let accountProfile = await profileService.createProfile(authenticationProfile);
            this.setState({ accountProfile: accountProfile });
            debugger;
        } else {
            alert("call create");

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
            return (<Loader title='Loading your profile' />);
        }
        let emailAddress = (this.state.accountProfile === null) ? "" : this.state.accountProfile.emailAddress;
        debugger;
        return (
            <div className="container main-content">
                <div className="columns is-centered has-text-centered">
                    <div className="column is-four-fifths">
                        <h1>My Profile</h1>
                        <h2>{this.state.alert}</h2>
                        <MagicProfileComponent emailAddress={emailAddress} />
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