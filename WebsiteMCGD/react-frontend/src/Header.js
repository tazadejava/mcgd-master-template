import auth from "./auth";
import {Link} from "react-router-dom";
import React from "react";

export function getCurrentWeekNumber() {
    return 1;
}

export function getBackendSite() {
    return "http://1.2.3.4:3075";
}

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.title = props.title;

        this.pagination = []

        switch(this.title) {
            case "DASHBOARD":
                this.pagination = (
                <ul className="pagination">
                    <li className="active"><a href="/">DASHBOARD</a></li>
                    <li><a href="/resources">RESOURCES</a></li>
                    <li><Link to="/logout">LOGOUT</Link></li>
                </ul>);
                break;
            case "RESOURCES":
                this.pagination = (
                <ul className="pagination">
                    <li><a href="/">DASHBOARD</a></li>
                    <li className="active"><a href="/">RESOURCES</a></li>
                    <li><Link to="/logout">LOGOUT</Link></li>
                </ul>);
                break;
        }

        if(auth.getName() == null) {
            this.welcomeNotice = <p>Welcome! You are currently visiting the offline website.</p>;
        } else {
            this.welcomeNotice = <p>Welcome, {auth.getName()}! — Team Members: {auth.getGroupMembers()} — Team Minecraft Server: {auth.getServer()}</p>;
        }
    }

    render() {
        return (
            <div>
                <nav>
                    {/*Navigation Bar, Header*/}
                    <div className="header">
                  <span>
                    <h4>Game Design and Development with Minecraft and Java — Week {getCurrentWeekNumber()}</h4>
                    {this.welcomeNotice}
                  </span>
                    </div>
                </nav>

                {/*DASHBOARD*/}

                <div className="container dashboard">
                    <img src="https://gamepedia.cursecdn.com/minecraft_gamepedia/4/45/Compass_JE1_BE1.gif" className="center dashboardImage"/>
                    <h1>{this.title}</h1>
                    {this.pagination}
                </div>
            </div>
        );
    }
}

export default Header;