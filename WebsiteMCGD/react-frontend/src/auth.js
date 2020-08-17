import axios from "axios";

import {getBackendSite} from './Header';

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const auth = {
    _authorized: false,
    _username: null,
    _cookiePassword: null,
    _group: null,
    _groupMembers: null,
    _name: null,
    _serverAddress: null,
    isAuthorized() {
        return this._authorized;
    },
    getUsername() {
        return this._username;
    },
    getUserGroup() {
        return this._group;
    },
    getGroupMembers() {
        return this._groupMembers;
    },
    getName() {
        return this._name;
    },
    getServer() {
        return this._serverAddress;
    },
    getCookiePassword() {
        return this._cookiePassword;
    },
    attemptAuthenticate() {
        return new Promise(((resolve, reject) => {
            setTimeout(resolve, 1000);

            if(getCookie("loginUsername") == null) {
                this._authorized = false;
                resolve();
            } else {
                axios.post(getBackendSite() + "/api/login", {
                    username: getCookie("loginUsername"),
                    password: getCookie("loginPassword"),
                }, {})
                    .then((res) => {
                        if (res.data.info === "SUCCESS-COOKIE") {
                            this._username = getCookie("loginUsername");
                            this._authorized = true;
                            this.obtainUserData(() => resolve);
                        } else {
                            this._authorized = false;
                            resolve();
                        }
                    }).catch((err) => {
                        this._authorized = false;
                        resolve();
                    });
            }
        }));
    },
    obtainUserData(onResult) {
        fetch(getBackendSite() + "/api/userdata?username=" + this._username)
            .then((res) => res.json())
            .then((json) => {
                this._group = json.group;
                this._groupMembers = json.groupMembers;
                this._name = json.name;
                this._serverAddress = json.serverAddress;

                this._cookiePassword = getCookie("loginPassword");

                onResult();
            });
    }
};

export default auth;