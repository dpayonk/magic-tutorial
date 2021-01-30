import React from 'react'
import Layout from '../layout'
import Loader from '../components/Loader';
import AuthForm from '../components/AuthForm';
import { Logger } from 'payonkjs';
import AuthService from '../services/AuthService';
import AccountProfileService from '../services/AccountProfileService';
import Configuration from '../Configuration';


class HealthcheckIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "initialized",
            isLoggedIn: false,
            accountService: new AccountProfileService(),
            alert: ""
        }
        this.authService = AuthService.getInstance();
        this.profileService = AccountProfileService.getInstance();
    }

    async componentDidMount() {
        let alert = "";

        let isLoggedIn = await this.authService.isLoggedIn();
        let healthy = await this.profileService.getHealth();
        debugger;

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
        if (this.state.status !== 'mounted') {
            return (<Loader title="Checking Health" />);
        }

        if (this.state.isLoggedIn === true) {
            return (

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

            )
        } else {
            return (

                <div className="main-content">
                    <div className="columns is-centered">
                        <div className="column is-half">
                            <h1>Hello</h1>
                            <AuthForm />
                        </div>
                    </div>
                </div>

            );
        }
    }
}

export default HealthcheckIndex
