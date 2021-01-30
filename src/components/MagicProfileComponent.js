import React from 'react'
import { Logger, UserRepository } from 'payonkjs';
import AuthService from '../services/AuthService'


export default ({ emailAddress, publicAddress, didToken, onLogout }) => {
    let alert = (didToken !== undefined && didToken !== "") ? "" : "";

    function handleLogout() {
        alert='Logging you out!';
        let service = AuthService.getInstance();
        UserRepository.clearAll();

        debugger;
        service.logout();
        if (onLogout !== undefined){
            onLogout();
            Logger.alert("You have been logged out!");
        }

        debugger;
    };

    return (
        <div>

            <div className="field">
                <div className="control">
                    <button onClick={handleLogout} className="button button-primary is-pulled-right">Logout</button>
                    <div className="">{alert}</div>
                </div>
            </div>

            <div id="email-control" className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left">
                    <input readOnly="readonly" value={emailAddress} className="input " type="email" name="email"
                        required="required" placeholder="your@email.com" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-envelope"></i>
                    </span>
                </div>
            </div>
            <div id="public-address-control" className="field">
                <label className="label">Public Address</label>
                <div className="control has-icons-left">
                    <input readOnly="readonly" value={publicAddress}
                        className="input " name="publicAddress"
                        required="required" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                    </span>
                </div>

            </div>
            <div id="public-address-control" className="field">
                <label className="label">Magic Access Token (DID)</label>
                <div className="control has-icons-left">
                    <input readOnly="readonly" value={didToken}
                        className="input " name="publicAddress"
                        required="required" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                    </span>
                </div>
            </div>
        </div>
    )
}