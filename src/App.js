import React from "react"
import { navigate, Router } from "@reach/router"
import Loader from "./components/Loader";
import { Logger } from 'payonkjs';
import AuthService from "./services/AuthService";
import AccountProfileService from "./services/AccountProfileService";
import LoginIndex from './routes/LoginIndex';
import HomeIndex from './routes/HomeIndex';
import UserHomeIndex from './routes/UserHomeIndex';
import HealthcheckIndex from './routes/HealthcheckIndex';

Logger.catchBreakpoint = true;

class PrivateRoute extends React.Component {

  render() {
    if (this.props.isLoggedIn !== true) {
      navigate('/login');
      return (<LoginIndex alert="You are not authorized to view this page" />);
    }

    return (
      <UserHomeIndex />
    )
  }
}

class Redirector extends React.Component {

  render() {
    if (this.props.isLoggedIn !== true) {
      navigate('/login');
      return (<LoginIndex alert="You have been logged out!" />);
    }

    return (
      <div>
        <h1>The page you are looking for does not exist</h1>
      </div>
    )
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      status: 'loading',
    };
    this.authService = new AuthService();

    this.onLogin = this.onLogin.bind(this);
  }

  async componentDidMount() {
    let isLoggedIn = false;

    try {

      if (window.location.search.length > 0) {
        // Looking for magic credential in query string
        // This is called when the new instance is loaded
        let authenticationProfile = await this.authService.handleMagicAuthenticationRedirect();
        let accountProfile = await AccountProfileService.getInstance().createProfile(authenticationProfile);
        Logger.alert('app.js: Create a new profile for you.', accountProfile);
      }

      isLoggedIn = await this.authService.isLoggedIn();
    } catch (error) {
      Logger.error("app.js: An exception occurred loading the app.", error);
    }

    this.setState({ status: 'mounted', isLoggedIn: isLoggedIn });
  }

  onLogin() {
    this.setState({ isLoggedIn: true });
    navigate('/home');
  }

  render() {
    if (this.state.status === 'loading') {
      return (<Loader title="Hang tight, starting up the app!" />)
    }

    return (

      <Router basepath="/">
        <LoginIndex path="/login" onLoginCallback={this.onLogin} />
        <HealthcheckIndex path="/health" />
        <PrivateRoute isLoggedIn={this.state.isLoggedIn} path="/home" />
        <HomeIndex path="/" />
        <Redirector default />
      </Router>

    );
  }
}

export default App