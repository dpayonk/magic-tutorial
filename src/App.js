import React from "react"
import { navigate, Router } from "@reach/router"
import Loader from "./components/Loader";
import { Logger } from 'payonkjs';
import AuthForm from './components/AuthForm';
import AuthService from "./services/AuthService";
import AccountProfileService from "./services/AccountProfileService";
import Layout from './layout';
import LoginIndex from './routes/LoginIndex';
import HomeIndex from './routes/HomeIndex';
import UserHomeIndex from './routes/UserHomeIndex';

class PrivateRoute extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.isLoggedIn !== true) {
      navigate('/login');
      return (<LoginIndex />);
    }

    return (
      <UserHomeIndex />
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

    // This requires a lot of coordination, but the app is the only place we know 
    // we can subscribe to global updates (besides singletons loaded here? )
    // perhaps instantiate statestore here?
    // UserStore.onSessionUpdate(function (model) {
    //   Logger.info("received update, new Model", model);
    //   self.setState({ userSession: model });
    // });
  }

  async componentDidMount() {
    let isLoggedIn = false;

    try {

      if (window.location.search.length > 0) {
        // Looking for magic credential in query string
        let authenticationProfile = await this.authService.onAuthenticationRedirectCallback();
        let accountProfile = AccountProfileService.getInstance().createProfile(authenticationProfile);
        Logger.alert('app.js: Create a new profile for you.', accountProfile);
      }

      isLoggedIn = await this.authService.isLoggedIn();
    } catch (error) {
      Logger.error("app.js: An exception occurred loading the app.", error);
    }

    this.setState({
      status: 'mounted', isLoggedIn: isLoggedIn, status: 'mounted'
    });
  }

  render() {

    let location = "Home";
    if (this.state.status === 'loading') {
      return (<Loader title="Hang tight, starting up the app!" />)
    }

    return (
      <Layout location={location}>
        <Router basepath="/">
          <LoginIndex path="/login" />
          <PrivateRoute isLoggedIn={this.state.isLoggedIn} path="/home" />
          <HomeIndex default path="/" />
        </Router>
      </Layout>
    );
  }
}

export default App