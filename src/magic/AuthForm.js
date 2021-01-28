import React, { Component } from "react"
import Loader from '../components/Loader';
import AuthService from '../services/AuthService'
import AccountProfileService from "../services/AccountProfileService";
import UserRepository from "../repository/UserRepository";

class AuthForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      alert: "",
      authService: new AuthService(),
      accountService: new AccountProfileService(),
      emailInput: "",
      fetchedAuthorization: false, isAuthorized: false,
      fetchedLogin: false, isLoggedIn: false,
      status: "initialized",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  async componentDidMount() {
    await this.fetchLogin();
    await this.fetchAuthorizationProfile();

    if (this.state.authenticationProfile !== null) {
      // This is too complex combiniing a profile with magic link, need better model
      if (this.state.isAuthorized == true) {
        this.setState({ emailInput: this.state.authenticationProfile.emailAddress });        
      }
    } else {
      this.setState({ alert: "Your profile could not be fetched" });
    }
    this.setState({ status: 'mounted' });
  }

  async fetchLogin() {
    if (this.state.fetchedLogin === false) {
      const isLoggedIn = await this.state.authService.isLoggedIn();
      this.setState({ isLoggedIn: isLoggedIn, fetchedLogin: true });
      return isLoggedIn;
    } else {
      return this.state.isLoggedIn;       // fetch from cache
    }
  }

  isValidEmail(emailText) {
    return true;
  }

  async isAuthorized() {
    if (this.state.fetchedAuthorization === false) {
      await this.fetchAuthorizationProfile(); // authorization status set by getting profile
      return this.state.isAuthorized;
    } else {
      return this.state.isAuthorized;       // fetch from cache
    }
  }

  async fetchAuthorizationProfile() {
    let isAuthorized = false;
    let authenticationProfile = await this.state.authService.getAuthenticationProfile();

    if (authenticationProfile !== null) {      
      isAuthorized = await this.state.accountService.fetchAuthorizationStatus(authenticationProfile.emailAddress);
      this.setState({
        authenticationProfile: authenticationProfile,        
      });
    }
    this.setState({ isAuthorized: isAuthorized, fetchedAuthorization: true });
  }

  handleChange(event) {
    this.setState({ emailInput: event.target.value });
  }

  async handleRegister(e) {
    e.preventDefault();
    if (this.isValidEmail(this.state.emailInput)) {
      this.setState({ alert: "Starting auth process, setting email..." });
      let didToken = await this.state.authService.loginMagic(this.state.emailInput);
      UserRepository.publishLogin(this.state.emailInput, didToken);
      debugger;
    }
  };

  render() {

    if (this.state.status !== 'mounted') {
      return (<Loader title="..." />);
    }

    if (this.state.isLoggedIn && this.state.isAuthorized) {
      return (<div className="container" style={{ minHeight: "150px", marginBottom: "5vh" }}>
        <label style={{ fontSize: "1.3rem", fontWeight: "700", paddingBottom: "10px" }}>
          {this.state.alert}
        </label>
        <div><p style={{ textIndent: "20px" }}>
          Check out the <a className="" href="/app"> private feed</a> for new pics!
            </p>
        </div>
      </div>);
    } else if (this.state.isLoggedIn === true && this.state.isAuthorized === false) {
      return this.renderUnauthorized();
    } else {
      return this.renderLoginForm();
    }
  }

  renderUnauthorized() {
    let email = this.state.authenticationProfile.emailAddress;
    return (
      <div>
        <p style={{ fontSize: "1.4rem", textIndent: "10px", maxWidth: "600px" }}>
          We don't have your email address ({email}) on file yet.  
          <br/><br/>
          Give us a few minutes to authorize you.
          If you're impatient, send us a message.
            </p>
      </div>
    )
  }

  renderLoginForm() {
    return (<div>
      <p>Register with email</p>

      <form>
        <div className="field">
          <label className="label">Email</label>
          <div className="control has-icons-left">
            <input style={{maxWidth: "400px"}} value={this.state.emailInput} onChange={this.handleChange} className="input " type="email" name="email"
              required="required" placeholder="your@email.com" />
            <span className="icon is-small is-left">
              <i className="fas fa-envelope"></i>
            </span>
          </div>

        </div>
        <div className="field is-grouped">
          <div className="control">
            <div className="field">
              <button onClick={this.handleRegister} className="button is-light is-pull-right" type="submit">
                Register
          </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    )
  }
};


export default AuthForm
