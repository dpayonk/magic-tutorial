import React from 'react';


class HomeIndex extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alert: "Welcome to the Magic Tutorial"
        }
    }

    render() {
        return (
            <div className="container main-content">
                <div className="columns has-text-centered">
                    <div className="column is-full">
                        <h2>{this.state.alert}</h2>
                        <br/>

                        <a className="button is-primary is-large" href="/login">Login</a>
                    </div>

                </div>
            </div>
        );
    }
}

export default HomeIndex;