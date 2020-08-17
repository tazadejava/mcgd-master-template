import React from 'react';
import {withRouter, Redirect} from "react-router-dom";

import auth from "../auth"

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

class Logout extends React.Component {
    constructor(props) {
        super(props);

        deleteCookie("loginPassword");
        deleteCookie("loginUsername");

        auth._authorized = false;
    }

    render() {
        return <Redirect to="/login"/>;
    }
}

export default withRouter(Logout);