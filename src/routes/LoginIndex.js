import React from 'react'
import Layout from '../layout'
import Loader from '../components/Loader';
import AuthForm from '../magic/AuthForm';
import Logger from '../base/Logger';
import AuthService from '../services/AuthService';
import AccountProfileService from '../services/AccountProfileService';

class LoginIndex extends React.Component {
    // User should already be authenticated and validated from the app.js
    // consider changing this to a confirmation page of sorts to enter in 
    // other information and create/edit or tutorial
    constructor(props) {
        super(props);
        const environment = 'development';
        this.state = {
            environment: environment,
            status: "initialized",
            isLoggedIn: false,
            accountService: new AccountProfileService(),
            alert: ""
        }
        this.authService = AuthService.getInstance();
    }

    async componentDidMount() {
        let alert = "";

        let isLoggedIn = await this.authService.isLoggedIn();
        if (isLoggedIn) {
            alert = `Welcome Back`;
            let authenticationProfile = await this.authService.getAuthenticationProfile();
            if (authenticationProfile !== null) {
                let authorized = await this.state.accountService.fetchAuthorizationStatus(authenticationProfile.emailAddress, 'feed');
                this.setState({ emailAddress: authenticationProfile.emailAddress, feedAuthorization: authorized });
            }
        }


        this.setState({ alert: alert, isLoggedIn: isLoggedIn, status: 'mounted' });
    }

    render() {
        let location = "Login";

        if (this.state.status !== 'mounted') {
            return (<Loader />);
        }

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
                                    <div>Install your apps</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Layout>
            )
        } else {
            return (
                <Layout location={location}>
                    <div className="main-content">
                        <div className="columns is-centered">
                            <div className="column is-half">
                                <h1>Hello</h1>                                
                                <AuthForm />
                            </div>
                        </div>
                    </div>
                </Layout>
            );
        }
    }
}

export default LoginIndex
