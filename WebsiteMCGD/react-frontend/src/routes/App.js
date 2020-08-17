import React from 'react';
import '../routes-css/App.css';
import axios from 'axios';
import ReactDropzone from 'react-dropzone';
import {withRouter} from "react-router-dom";

import auth from "../auth";
import Header from "../Header";

import {getCurrentWeekNumber, getBackendSite} from "../Header"

class Log extends React.Component {
    constructor(props) {
        super(props);

        this.group = auth.getUserGroup();
        this.state = {
            lines: []
        };
    }

    render() {
        var linesRendered = [];

        for (var lineIndex in this.state.lines) {
            var timestampSplit = this.state.lines[lineIndex].split(" ")[0].replace("[", "").replace("]", "").split(":");
            var date = new Date();
            date.setHours(parseInt(timestampSplit[0]), parseInt(timestampSplit[1]), parseInt(timestampSplit[2]));

            var est = new Date();
            est.setHours(est.getHours() + 3); //adjusted for EST time from PST time

            var diff = (est).getTime() - date.getTime();

            if (diff / 1000 <= 5) {
                var color = {color: "green"};
            } else {
                var color = null;
            }

            linesRendered.push(<h5 className="logLine" key={lineIndex} style={color}>{this.state.lines[lineIndex]}</h5>);
        }

        return (
            <div className="log">
                <h4 style={{textAlign: "center"}}>Log output:</h4>
                {linesRendered}
            </div>
        );
    }

    componentDidMount() {
        this.getLines();

        this.timerID = setInterval(
            () => {
                this.getLines();
            },
            500
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    getLines() {
        fetch(getBackendSite() + "/api/userlog?group=" + this.group)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    var logLines = [];

                    for (var line in data.data) {
                        logLines.push(data.data[line].content);
                    }

                    this.setState({
                        lines: logLines
                    });
                }
            });
    }
}

class DropHandler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentFilesText: "No current files attached.",
            currentFiles: [],
            buttonDisabled: true,
            buttonText: "Upload to server"
        };
    }

    render() {
        if (this.state.filesAttachedInfo) {
            var attachedFiles = [];
            for (var index in this.state.filesAttachedInfo) {
                attachedFiles.push(<ul>{this.state.filesAttachedInfo[index]}</ul>);
            }
        } else {
            var attachedFiles = null;
        }

        return (
            <div className="uploadMargin">
              Upload files to your team's server.

              <div className="uploadBox">
                <ReactDropzone onDrop={this.onDrop} accept=".java" maxSize={1024 * 256}>
                  {({getRootProps, getInputProps}) => (
                      <div {...getRootProps()} className="uploadBoxDropzone">
                        <input {...getInputProps()}/>
                        <p>Drag your .java files here to start the verification process!</p>
                        <br/>
                        <p>{this.state.currentFilesText}</p>
                        {attachedFiles}
                      </div>
                  )}
                </ReactDropzone>
              </div>

              <button className="btn btn-default" type="button" disabled={this.state.buttonDisabled}
                      onClick={this.uploadFiles}>{this.state.buttonText}</button>
            </div>
        );
    }

    getLastModifiedText(lastModified) {
        lastModified = Date.now() - lastModified;
        if (lastModified / 1000 / 60 >= 60) {
            return "more than an hour ago";
        } else {
            var seconds = Math.floor((lastModified / 1000) % 60);
            var minutes = Math.floor((lastModified / 1000 / 60) % 60);

            if (minutes === 0) {
                return seconds + " second" + (seconds === 1 ? "" : "s") + " ago";
            } else {
                return minutes + " minute" + (minutes === 1 ? "" : "s") + " ago";
            }
        }
    }

    onDrop = (files) => {
        var fileAttachedInfo = [];
        if (files.length === 0) {
            var fileText = "No current files attached.";
        } else {
            var fileText = files.length + " files attached:";
            var fileAttachedInfo = [];

            for (var index in files) {
                var lastModifiedText = this.getLastModifiedText(files[index].lastModified);
                fileAttachedInfo.push(files[index].name + " (modified " + lastModifiedText + ")");
            }
        }

        this.setState({
            currentFilesText: fileText,
            filesAttachedInfo: fileAttachedInfo,
            currentFiles: files,
            buttonDisabled: files.length === 0,
            buttonText: "Upload to server"
        });
    }

    postToDatabase(names, datas) {
        console.log("PUSHING " + names);
        axios.post(getBackendSite() + "/api/uploadcode", {
            group: auth.getUserGroup(),
            names: names,
            datas: datas,
            username: auth.getUsername(),
            level: getCurrentWeekNumber()
        }, {})
            .then((res) => {
                if (res.data === "SUCCESS") {
                    this.setState({
                        currentFilesText: "No current files attached.",
                        currentFiles: [],
                        buttonDisabled: true,
                        buttonText: "Upload success!"
                    });
                } else {
                    this.setState({
                        currentFilesText: "No current files attached.",
                        currentFiles: [],
                        buttonDisabled: true,
                        buttonText: "Something went wrong..."
                    });
                }
            }).catch((err) => {
            this.setState({
                currentFilesText: "No current files attached.",
                currentFiles: [],
                buttonDisabled: true,
                buttonText: "Something went wrong..."
            });
        });
    }

    uploadFiles = () => {
        var names = [];
        var datas = [];
        var count = 0;

        var files = this.state.currentFiles;

        var nameCall = (index, name) => {
            files[index].text().then((res) => {
                names.push(name);
                datas.push(res);
                count++;
                if (count === files.length) {
                    this.postToDatabase(names, datas);
                }
            });
        }

        for (var index = 0; index < files.length; index++) {
            nameCall(index, files[index].name);
        }

        this.setState({
            currentFilesText: "No current files attached.",
            currentFiles: [],
            buttonDisabled: true,
            buttonText: "Uploading, please wait..."
        });
    }
}

class ChallengeInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false
        };
    }

    componentDidMount() {
        this.getChallengeData();

        this.timerID = setInterval(
            () => {
                this.updateTimer();

                if (!this.state.active) {
                    this.getChallengeData();
                }
            },
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    getChallengeData() {
        fetch(getBackendSite() + "/api/challenge")
            .then((res) => res.json())
            .then((data) => {
                if (data.active) {
                    this.setState({
                        ready: true,
                        active: true,
                        header: data.header,
                        title: data.title,
                        link: data.link,
                        description: data.description,
                        constraints: data.constraints,
                        countdown: this.getCountdown()
                    });
                } else {
                    this.setState({
                        ready: true,
                        active: false
                    });
                }
            })
            .catch((err) => {
                console.log("ERROR: " + err);
                this.setState({
                    ready: true,
                    active: false
                });
            });
    }

    getCountdown() {
        var now = Date.now();
        var deadline = new Date();

        deadline.setHours(16);
        deadline.setMinutes(30);
        deadline.setSeconds(0);

        var diff = deadline - now;

        var neg = false;
        if (diff < 0) {
            neg = true;
            diff = -diff;
        }

        var seconds = Math.floor((diff / 1000) % 60);
        var minutes = Math.floor((diff / 1000 / 60) % 60);
        var hours = Math.floor((diff / 1000 / 60 / 60) % 24);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (hours > 0) {
            if (hours < 10) {
                hours = "0" + hours;
            }

            return (neg ? "-" : "") + hours + ":" + minutes + ":" + seconds;
        } else {
            return (neg ? "-" : "") + minutes + ":" + seconds;
        }
    }

    updateTimer() {
        if (this.state.ready && this.state.active) {
            this.setState({
                countdown: this.getCountdown()
            });
        }
    }

    render() {
        if (this.state.ready) {
            if (this.state.active) {
                return (
                    <div>
                      <div className="roundcorner boxlabel challengeActive" id="active">
                          <span className="challengeText">
                            <h3>{this.state.header}</h3>
                            <h4>{this.state.title}</h4>
                            {/*{this.state.countdown.startsWith("-")*/}
                            {/*    ? <h4>00:00</h4>*/}
                            {/*    : <h4>{this.state.countdown} remaining</h4>}*/}
                            <br/>
                            {this.state.description}
                            <br/>
                            <br/>
                            {this.state.constraints}
                          </span>
                      </div>

                      <div className="roundcorner boxlabel codeInterface">
                        <span className="challengeText">
                          <h3>Class Code and Files</h3>
                          <h4>Download/Upload</h4>
                          <br/>

                          <button type="button" className="btn btn-default"><a href={this.state.link}>Download Challenge Template Zip File</a></button>

                          <br/>

                          <DropHandler />

                          <br/>

                          <Log />

                        </span>
                      </div>
                    </div>
                );
            } else {
                return (
                    <div className="roundcorner boxlabel challengeInactive" id="inactive">
                      <span className="challengeText">
                        <h3>The challenge is currently inactive!</h3>
                      </span>
                    </div>
                );
            }
        } else {
            return (
                <div className="roundcorner boxlabel challengeInactive" id="inactive">
                      <span className="challengeText">
                        <h3>Please wait...</h3>
                      </span>
                </div>
            );
        }
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
              <Header title="DASHBOARD"/>

              <div className="container">
                <ChallengeInfo/>
              </div>
            </div>
        );
    }
}

export default withRouter(App);
