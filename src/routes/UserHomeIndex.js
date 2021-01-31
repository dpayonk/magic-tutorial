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
import FilerobotImageEditor from 'dpayonk-image-editor';


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
            editImageUrl: 'https://nyc3.digitaloceanspaces.com/com.payonk.clique/20210114-181146--20210114-174832--stephen-walker-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=KSB4OEBLVBM6HPQGPVDM%2F20210115%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20210115T001146Z&X-Amz-Expires=6000&X-Amz-SignedHeaders=host&X-Amz-Signature=2920e95f97ee6d1cbc0895f42ebb181f483c901ffe43943004e327955d20e750',
            showImageEditor: false,
            status: 'initialized',
            isShow: false
        }
        this.accountProfileService = AccountProfileService.getInstance();

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.toggleCreator = this.toggleCreator.bind(this);
    }

    toggleCreator(){
        if(this.state.isShow === true){
            this.setState({isShow: false});
        } else {
            this.setState({isShow: true});
        }
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
                            <p>Here is where authorized apps are displayed</p>
                            <button className="button is-primary" onClick={this.toggleCreator}>Edit a Photo</button>
                            <FilerobotImageEditor
                                show={this.state.isShow}
                                onUpload={(img) => { console.log(img); }}
                                src={this.state.editImageUrl}
                                onClose={() => { this.setState({ isShow: false }); }}
                            />
                        </div>
                        <div className="column is-two-fifths">
                            <div style={{ margin: "0px 0px 10px 0px" }} className="is-pulled-right">
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