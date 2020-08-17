import '../routes-css/Login.css';
import React from 'react';
import { Button, Form, FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom'
import axios from "axios";

import {withRouter} from 'react-router-dom';

import auth from "../auth"

import {getBackendSite} from '../Header';

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function Feedback(props) {
    if(props.username === "wrong" && !props.valid) {
        return (<FormFeedback className="invalid">Your username or password was incorrect.</FormFeedback>);
    }

    if(props.valid) {
        return null;
    } else {
        if(props.username === "true") {
            return (<FormFeedback className="invalid">Please enter a username.</FormFeedback>);
        } else {
            return (<FormFeedback className="invalid">Please enter a password.</FormFeedback>);
        }
    }
}

class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.isAuthorized = auth.isAuthorized();

        this.state = {
            validUsername: true,
            validPassword: true,
            username: "",
            password: "",
            validCombination: true,
            loginButtonEnabled: true
        };

        this.checkServerOnline();
    }

    checkServerOnline() {
        fetch(getBackendSite() + "/api/onlinetest")
            .catch(reason => {
                this.setState({serverOffline: true});
            });
    }

    onSubmit = (e) => {
        e.preventDefault();

        var validUsername = this.state.username.length > 0;
        var validPassword = this.state.password.length > 0;

        this.setState({
           validUsername: validUsername,
           validPassword: validPassword,
            validCombination: true,
            loginButtonEnabled: false
        });

        if(this.state.validUsername && this.state.validPassword) {
            axios.post(getBackendSite() + "/api/login", {
                username: this.state.username,
                password: this.state.password,
            }, {})
                .then((res) => {
                    if(res.data.info === "SUCCESS") {
                        auth._authorized = true;
                        auth._username = this.state.username;
                        auth.obtainUserData(() => {
                            this.setState({
                                validCombination: true,
                                loginButtonEnabled: true
                            });

                            setCookie("loginUsername", this.state.username, 90);
                            setCookie("loginPassword", res.data.password, 90);

                            this.props.history.push("/");
                        });
                    } else {
                        this.setState({
                            password: "",
                            validCombination: false,
                            loginButtonEnabled: true
                        });
                    }
                }).catch((err) => {
                    this.setState({
                        password: "",
                        validCombination: false,
                        loginButtonEnabled: true,
                        serverOffline: true
                    });
            });
        }
    }

    handleChange = (event) => {
        const {target} = event;
        const {name} = target;
        const value = target.value;
        this.setState({
            [name]: value,
        })
    }

    render() {
        if(this.isAuthorized) {
            return (
                <Redirect to="/" />
            );
        } else {
            return (
                <div className="centerScreen">
                    <Form onSubmit={this.onSubmit}>
                        <img src="https://gamepedia.cursecdn.com/minecraft_gamepedia/c/c5/Oak_Log_Axis_Y_JE5_BE3.png"
                             className="center" style={{width: "10%"}} />
                        <h2>LOGIN</h2>
                        <h5 className="loginText">Your username and password can be found in the email you received for the class.</h5>
                        {(this.state.serverOffline)
                            ? <h5 className="loginText" style={{backgroundColor: "lightBlue", padding: "1rem"}}>NOTICE: It seems that the server is currently offline. If you aren't currently in class, this is normal. You may still access the resources page by visiting this link: <a href="/resources">Resources Page</a></h5>
                            : null}
                        <Feedback username="wrong" valid={this.state.validCombination}/>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter your username"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <Feedback username="true" valid={this.state.validUsername}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                onChange={(e) => this.handleChange(e)}
                            />
                            <Feedback username="false" valid={this.state.validUsername}/>
                        </FormGroup>
                        <Button className="btn btn-default" type="submit" disabled={!this.state.loginButtonEnabled}>Login</Button>
                    </Form>
                </div>
            );
        }
    }
}

export default withRouter(LoginPage);