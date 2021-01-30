import React from 'react'
import Layout from '../layout'
import Loader from '../components/Loader';
import AuthForm from '../components/AuthForm';
import { Logger } from 'payonkjs';
import AuthService from '../services/AuthService';
import AccountProfileService from '../services/AccountProfileService';
import { UserRepository } from 'payonkjs';

class LoginIndex extends React.Component {
    // User should already be authenticated and validated from the app.js
    // consider changing this to a confirmation page of sorts to enter in 
    // other information and create/edit or tutorial
    // props.onLogin
    constructor(props) {
        // props.onLogin for when user is logged in
        super(props);
        const environment = 'development';
        this.state = {
            environment: environment,
            status: "initialized",
            isLoggedIn: false,
            authenticationProfile: null,
            alert: ((props.alert !== undefined && props.alert !== null) ? props.alert : "")
        }
        this.authService = AuthService.getInstance();
        this.profileService = AccountProfileService.getInstance();

        this.handleRefresh = this.handleRefresh.bind(this);
        this.authEventHandler = this.authEventHandler.bind(this);
    }

    async componentDidMount() {
        let isLoggedIn = await this.authService.isLoggedIn();
        if (isLoggedIn) {
            let authenticationProfile = await this.authService.getAuthenticationProfile();
            if (authenticationProfile !== null) {
                let authorized = await this.profileService.fetchAuthorizationStatus(authenticationProfile.emailAddress, 'feed');
                this.setState({
                    alert: 'Welcome back',
                    authenticationProfile: authenticationProfile,
                });

                if (authorized === false) {
                    this.setState({ alert: 'Sorry, but we could not fetch your profile at this time' });
                    Logger.warn(`Check the backend in case it's not available.`);
                } else {
                    this.props.onLoginCallback();
                    this.setState({ alert: `Welcome, this should default you to your home page` });
                }
            }
        }

        // if logged in, it should redirect
        this.setState({ isLoggedIn: isLoggedIn, status: 'mounted' });
    }

    async handleRefresh() {

        if (this.state.authenticationProfile !== null) {
            let profileService = AccountProfileService.getInstance();
            let accountProfile = await profileService.createProfile(this.state.authenticationProfile);
            debugger;
            if (accountProfile !== null) {
                this.props.onLoginCallback();
            } else {
                this.setState({alert: 'There was a problem fetching your account profile'});
            }
        } else {
            alert("Authentication Profile is null.  You're going to need to reauthenticate!");
        }
    }

    renderJWTWidget() {
        let jwtToken = UserRepository.getJWT();
        if (jwtToken === null || jwtToken === "") {
            return (<div style={{ margin: "30px" }}>
                <button onClick={this.handleRefresh} className="button is-secondary">
                    Create Profile
                </button>
            </div>);
        } else {
            return (<div>
                <small>This should not be called.  An error occurred</small>
                <button onClick={this.handleRefresh} className="button is-secondary">
                    Refresh Session
                </button>
            </div>);
        }       
    }

    authEventHandler(emailAddress, didToken){
        // This is the original screen, if you want to refresh the page
        // or send to a new page, this is where to do it.
        UserRepository.publishLogin(emailAddress, didToken);
    }

    render() {
        let location = "Login";
        let redirectRoute = '/home';

        if (this.state.status !== 'mounted') {
            return (<Loader />);
        }

        // Only is rendered when an accountProfile could not be fetched on the backend
        if (this.state.isLoggedIn === true) {
            return (
                <Layout location={location}>
                    <div className="container main-content">
                        <div>
                            <h2>{this.state.alert}</h2>
                        </div>
                        <div className="columns has-text-centered">
                            <div className="column">
                                <div className="has-text-centered">
                                    <div style={{ margin: "20px" }}>Our server backend is down</div>
                                    {this.renderJWTWidget()}
                                </div>
                            </div>

                        </div>
                    </div>
                </Layout>
            )
        }

        return (
            <Layout location={location}>
                <div className="main-content">
                    <div className="columns is-centered">
                        <div className="column is-full">
                            <h1>{this.state.alert}</h1>
                            <AuthForm eventHandler={this.authEventHandler}/>
                        </div>
                    </div>
                </div>
            </Layout>
        );

    }
}

export default LoginIndex
