import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import App from './routes/App';
import LoginPage from './routes/Login';
import ResourcesPage from './routes/ResourcesPage';
import Logout from './routes/Logout';

import auth from "./auth"

const AuthRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        auth.isAuthorized() && (!props.user || props.user === auth._username)
            ? <Component {...props} />
            : <Redirect to="/login" />
    )} />
)

ReactDOM.render(
    <h3 className="centerScreenMain">
        <img src="http://i.imgur.com/e6YHD.gif" />
        Loading . . .
    </h3>,
    document.getElementById('root'));

function render() {
    ReactDOM.render(
        <React.StrictMode>
            <Router>
                <Switch>
                    <AuthRoute path="/" exact component={App} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/resources" component={ResourcesPage} />
                    <Route path="/logout" component={Logout} />
                    <Redirect to="/"/>
                </Switch>
            </Router>
        </React.StrictMode>,
        document.getElementById('root'));
}

auth.attemptAuthenticate().then((res) => {
    render();
}).catch((err) => {
    render();
});

serviceWorker.unregister();