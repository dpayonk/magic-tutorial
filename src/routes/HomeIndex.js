import React from 'react';
import Layout from '../layout';

class HomeIndex extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alert: "Welcome to the Magic Tutorial"
        }
    }
    debugger;

    render() {
        let location = "Home";

        return (
            <Layout location={location} >
            <div className="container main-content">
                <div className="columns has-text-centered">
                    <div className="column is-full">
                        <h2>{this.state.alert}</h2>
                        <br/>

                        <a className="button is-primary is-large" href="/login">Login</a>
                    </div>

                </div>
            </div>
            </Layout>
        );
    }
}

export default HomeIndex;