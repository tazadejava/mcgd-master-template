import React from 'react';
import '../routes-css/ResourcesPage.css';
import Header from "../Header";
import ReactMarkdown from "react-markdown";

import {getCurrentWeekNumber} from "../Header"

function shouldShowLessonContent(weekNumber) {
    return weekNumber <= getCurrentWeekNumber();
}

function shouldShowChallenge(weekNumber) {
    return weekNumber <= getCurrentWeekNumber();
}

class ResourcesPage extends React.Component {
    constructor(props) {
        super(props);

        this.activeWeeks = [];
        const currentWeek = getCurrentWeekNumber();
        for(let i = 1; i <= currentWeek; i++) {
            this.activeWeeks.push(i);
        }
        
        this.loadedMarkdowns = {};
        this.state = {};
    }

    componentDidMount() {
        this.openPastPresentations(null);
        document.getElementById("defaultOpen").click();

        fetch(require("../markdown/development1.md")).then((response) => response.text()).then((text) => {
            this.setState({
                development1: text
            });
        });
    }

    loadMarkdownAsActiveTab(name) {
        if(name in this.loadedMarkdowns) {
            this.setState({
                activeTab: this.loadedMarkdowns[name]
            });
        } else {
            this.setState({
                activeTab: <ReactMarkdown className="activeTab tabcontent" source={"Loading..."}/>
            });

            try {
                fetch(require("../markdown/" + name + ".md")).then((response) => response.text()).then((text) => {
                    this.loadedMarkdowns[name] = <ReactMarkdown className="activeTab tabcontent" source={text}/>;
                    this.setState({
                        activeTab: this.loadedMarkdowns[name]
                    });
                });
            } catch(e) {
                this.setState({
                    activeTab: <ReactMarkdown className="activeTab tabcontent" source={"WIP. Check back later!"}/>
                });
            }
        }
    }

    openTab(event, tabNumber, tabType) {
        this.setTabActive(event);

        switch(tabType) {
            case "DEVELOPMENT":
                if(!shouldShowLessonContent(tabNumber)) {
                    this.setState({
                        activeTab: (<div className="activeTab tabcontent"><p>Check back after the lesson!</p></div>)
                    });
                    break;
                }

                this.loadMarkdownAsActiveTab("development" + tabNumber);
                break;
            case "DESIGN":
                if(!shouldShowLessonContent(tabNumber)) {
                    this.setState({
                        activeTab: (<div className="activeTab tabcontent"><p>Check back after the lesson!</p></div>)
                    });
                    break;
                }

                switch(tabNumber) {
                    case 1:
                        this.setState({
                            activeTab: (<div className="activeTab tabcontent">
                                <iframe className="docsView" src="https://docs.google.com/document/d/e/2PACX-1vRo_cv9taFWvDk2XQ-xCZw24C7Joo6fjVbWGiw3VrVky1LyhNP5NjghStnOdk5rVwhpK4sHzU40q_UH/pub?embedded=true"/>
                            </div>)
                        });
                        break;
                    case 2:
                        this.setState({
                            activeTab: (<div className="activeTab tabcontent">
                                <iframe className="docsView" src="https://docs.google.com/document/d/e/2PACX-1vQ1xteByGT7b7v4rLDDtdDt5LOZY297-l1vUwpZA1WLf-6Llv78JsQRj7KKu83JInV55Cm4XwJ3jGbY/pub?embedded=true"></iframe>
                            </div>)
                        });
                        break;
                    case 3:
                        this.setState({
                            activeTab: (<div className="activeTab tabcontent">
                                <iframe className="docsView" src="https://docs.google.com/document/d/e/2PACX-1vTteAeg1FriixqGAClAsUr6_9TB8o7GYtopfUTj4C5XuNhk1daVbuCqg7B2fq-FF0URu0PoKTW5tEaB/pub?embedded=true"></iframe>
                            </div>)
                        });
                        break;
                    case 4:
                        this.setState({
                            activeTab: (<div className="activeTab tabcontent">
                                <iframe className="docsView" src="https://docs.google.com/document/d/e/2PACX-1vRVFzi5v5q230yhGLTghh9AsVz3Dyy2Ua326qhvzqlgkVDKwZvMHXrX8sCzIEK_EbX4QoQ5gTbqWzuE/pub?embedded=true"></iframe>
                            </div>)
                        });
                        break;
                    case 5:
                        this.setState({
                            activeTab: (<div className="activeTab tabcontent">
                                <iframe className="docsView" src="https://docs.google.com/document/d/e/2PACX-1vTO9C23lVWOjwMfb-tzcIoShtz2yhOOIk2P89uVhosMsNFOcbcwdSgj0bdOvLdgPOY7UDYGKVnUGFr9/pub?embedded=true"></iframe>
                            </div>)
                        });
                        break;
                    case 6:
                        this.setState({
                            activeTab: (<div className="activeTab tabcontent">
                                <iframe className="docsView" src="https://docs.google.com/document/d/e/2PACX-1vRmmK0KV_EGTCaxlBc1Il5Hb7s27u5ukLPkFetRvPj2Z9qlL-p2M5tfHACRN70YSgVt31T7O9DB-Xx1/pub?embedded=true"></iframe>
                            </div>)
                        });
                        break;
                    default:
                        this.setState({
                            activeTab: <ReactMarkdown className="activeTab tabcontent" source={"WIP. Check back later!"}/>
                        });
                        break;
                }
                break;
            case "CHALLENGE":
                if(!shouldShowChallenge(tabNumber)) {
                    this.setState({
                        activeTab: (<div className="activeTab tabcontent"><p>Check back after class!</p></div>)
                    });
                    break;
                }

                this.loadMarkdownAsActiveTab("challenge" + tabNumber);
                break;
        }
    }

    openCustomTab(event, name) {
        this.setTabActive(event);

        this.setState({
            activeTab: (<div className="activeTab tabcontent"><p>Loading...</p></div>)
        });

        switch(name) {
            case "server":
                this.loadMarkdownAsActiveTab("server environment");
                break;
            default:
                this.setState({
                    activeTab: (<div className="activeTab tabcontent"><p>WIP. Check back later!</p></div>)
                });
                break;
        }
    }

    setTabActive(event) {
        if(event) {
            var tablinks = document.getElementsByClassName("tablinks");
            for (let i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }

            event.currentTarget.className += " active";
        }
    }

    openImportantInformation(event) {
        this.setTabActive(event);

        this.loadMarkdownAsActiveTab("important information", true);
    }

    openPastPresentations(event) {
        this.setTabActive(event);

        if(shouldShowLessonContent(getCurrentWeekNumber())) {
            this.loadMarkdownAsActiveTab("past presentations", true);
        } else {
            this.setState({
                activeTab: (
                    <div className="activeTab tabcontent"><p>Check back later!</p></div>
                )
            });
        }       
    }

    render() {
        return (
            <div>
                <Header title="RESOURCES"/>

                {/* <!-- DESIGN CHEATSHEETS --> */}

                <div className="container resourcesContainer">
                    <div className="tab">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <button className="tablinks specialButton" onClick={(event) => this.openImportantInformation(event)} id="defaultOpen">Important Information</button>
                            </h4>
                        </div>

                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <button className="tablinks specialButton" onClick={(event) => this.openPastPresentations(event)}>Past Presentations</button>
                            </h4>
                        </div>

                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a data-toggle="collapse" href="#collapse1">Past Challenges (+)</a>
                            </h4>
                        </div>
                        <div id="collapse1" className="collapse">
                            <ul className="list-group">
                                {this.activeWeeks.map(weekNumber => (
                                    <li className="list-group-item"><button className="tablinks" onClick={(event) => this.openTab(event, weekNumber, "CHALLENGE")}>Week {weekNumber}</button></li>
                                ))}
                            </ul>
                        </div>

                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a data-toggle="collapse" href="#collapse2">Design (+)</a>
                            </h4>
                        </div>
                        <div id="collapse2" className="collapse">
                            <ul className="list-group">
                                {this.activeWeeks.map(weekNumber => (
                                    <li className="list-group-item"><button className="tablinks" onClick={(event) => this.openTab(event, weekNumber, "DESIGN")}>Week {weekNumber}</button></li>
                                ))}
                            </ul>
                        </div>

                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <a data-toggle="collapse" href="#collapse3">Development (+)</a>
                            </h4>
                        </div>
                        <div id="collapse3" className="collapse">
                            <ul className="list-group">
                                {this.activeWeeks.map(weekNumber => (
                                    <li className="list-group-item"><button className="tablinks" onClick={(event) => this.openTab(event, weekNumber, "DEVELOPMENT")}>Week {weekNumber}</button></li>
                                ))}
                                <li className="list-group-item"><button className="tablinks" onClick={(event) => this.openCustomTab(event, "server")}>Server Environment</button></li>
                            </ul>
                        </div>
                    </div>

                {this.state.activeTab}

                </div>
            </div>
        );
    }
}

export default ResourcesPage;