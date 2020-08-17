const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const dateFormat = require('dateformat')
const { spawn } = require('child_process');

const fs = require('fs');
const path = require('path');

const loginData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../LocalDatabase/loginData.json")));
const groupData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../LocalDatabase/groupData.json")));
const userData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../LocalDatabase/userData.json")));

function isAuthorized(site, username, password) {
    if(username in loginData) {
        if(loginData[username].cookiePassword === password) {
            return true;
        }
    }

    return false;
}

function attachTimestamp(str) {
    const now = new Date();
    now.setHours(now.getHours() + 3);
    return "[" + dateFormat(now, "HH:MM:ss") + "] " + str;
}
function strip(lines) {
    //TODO: REMOVE THE LINES THAT HAVE [ THEN ENDS WITH m, WE HAVE TO FIND IT AND REMOVE IT (since it color codes maven lines)

    return lines;
}
function logLines(lines, Log) {
    

    lines = filterPersonalData(lines);

    //don't log maven warning
    if(lines.startsWith("WARNING: An illegal reflective access operation has occurred")) {
        return;
    }

    lines = strip(lines);

    if(lines.includes("\n")) {
        var split = lines.split("\n");
        for(var lineIndex in split) {
            if(split[lineIndex].length === 0) {
                continue;
            }

            newLine = attachTimestamp(split[lineIndex]);
            var logContent = new Log({content: newLine});
            logContent.save()
                .catch((err) => {
                    console.log(err);
                    res.send("Something went wrong.");
                }); 
        }
    } else {
        if(lines.length !== 0) {
            const logContent = new Log({content: attachTimestamp(lines)});
            logContent.save()
                .catch((err) => {
                    console.log(err);
                    res.send("Something went wrong.");
                }); 
        }
    }
}
function filterPersonalData(line) {
    var find = ""; //TODO: filter out stuff you don't want the students seeing (ex: your personal directories)
    var replace = new RegExp(find, 'g');

    return line.replace(replace, '');
}
function updatePlugin(groupNum, levelNum) {
    console.log("UPDATE PLUGIN FOR GROUP " + groupNum + " LEVEL " + levelNum);
    const Log = mongoose.model('LogGroup' + groupNum);

    var child = spawn("bash", ["scripts/updatepluginfiles.sh", groupNum, levelNum]);

    child.stdout.on('data', (buffer) => {
        logLines(buffer.toString(), Log);
    });

    child.stderr.on('data', (buffer) => {
        logLines(buffer.toString(), Log);
    });

    child.stdout.on('end', () => {
    });
}

function reviseGroupScore(groupNum, score) {
    // console.log("UPDATE SCORE FOR GROUP " + groupNum + ": " + score);

    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../LocalDatabase/challenge6scores.json")));

    data[groupNum]["score"] = score;
    data[groupNum]["lastscoremilli"] = (new Date()).valueOf();

    let dataString = JSON.stringify(data, null, 1);

    fs.writeFileSync(path.resolve(__dirname, "../LocalDatabase/challenge6scores.json"), dataString);
}

router.get('/api/userlog', (req, res) => {
    const groupNum = req.query.group;
    const Log = mongoose.model('LogGroup' + groupNum);

    Log.find().sort({_id:-1}).limit(30)
        .then((userLog) => {
            userLog.reverse();
            res.json({
                success: true,
                data: userLog
            });
        })
        .catch(() => {
            res.json({
                success: false
            })
        });
});

router.get('/api/challenge', (req, res) => {
    const challengeData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../LocalDatabase/ChallengeDescriptions/activeChallenge.json")));

    const challengeNumber = challengeData.currentChallenge;
    const isActive = challengeData.active;

    if(isActive) {
        const challengeDescription = JSON.parse(path.resolve(__dirname, "../LocalDatabase/ChallengeDescriptions/challenge" + challengeNumber + ".json"));
        res.json({
            active: true,
            header: challengeDescription.header,
            title: challengeDescription.title,
            link: challengeDescription.link,
            description: challengeDescription.description,
            constraints: challengeDescription.constraints,
        });
    } else {
        res.json({
            active: false
        });
    }
});

router.get('/api/localdatabase/challenge6scores', (req, res) => {
    if(req.get("key") && req.get("key") === "0eff6db3-4178-4bc2-b5e0-826ce44c47dd") {
        const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../LocalDatabase/challenge6scores.json")));
        res.json(data);
    }

    res.json();
});


router.get('/api/localdatabase/challenge6endtime', (req, res) => {
    if(req.get("key") && req.get("key") === "0eff6db3-4178-4bc2-b5e0-826ce44c47dd") {
        const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../LocalDatabase/challenge6endtime.json")));
        res.json(data);
    }

    res.json();
});

router.post('/api/localdatabase/challenge6scores', (req, res) => {
    const {
        groupNumber, key, score
    } = req.body;

    if(!groupNumber || !key || !score) {
        res.status(200).send({
            info: "FAILURE"
        });
        return;
    }

    if(key !== "0eff6db3-4178-4bc2-b5e0-826ce44c47dd") {
        res.status(200).send({
            info: "FAILURE"
        });
        return;
    }

    reviseGroupScore(groupNumber, score);

    res.status(200).send({
        info: "SUCCESS"
    });
});

router.get('/api/localdatabase/groupdata', (req, res) => {
    if(req.get("key") && req.get("key") === "ece4a377-2077-406c-b6d3-71aea2284fd7") {
        const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../LocalDatabase/groupData.json")));
        res.json(data);
    }
});

router.get('/api/localdatabase/userdata', (req, res) => {
    if(req.get("key") && req.get("key") === "a166da74-d919-4eb2-8076-ee5a33115cf4") {
        const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../LocalDatabase/userData.json")));
        res.json(data);
    }
});

router.get('/api/userdata', (req, res) => {
    const username = req.query.username;

    const result = {
        group: -1
    };

    //TODO: CHANGE IF YOUR GROUP NUMBER IS BIGGER
    var MAX_GROUPS = 8;

    for(var i = 1; i <= MAX_GROUPS; i++) {
        if(groupData["group" + i].members.includes(username)) {
            result.group = i;
            result.serverAddress = groupData["group" + i].serverAddress;

            let members = [...result.groupMembers = groupData["group" + i].members];
            members.splice(members.indexOf(username), 1);

            let membersString = "";
            if(members.length === 0) {
                result.groupMembers = "You're alone!";
            } else if(members.length === 1) {
                result.groupMembers = userData[members[0]].name;
            } else {
                for(var j = 0; j < members.length; j++) {
                    if(j === members.length - 1) {
                        membersString += "and " + userData[members[j]].name;
                    } else {
                        membersString += userData[members[j]].name;

                        if(members.length !== 2) {
                            membersString += ", ";
                        }
                    }
                }
                result.groupMembers = membersString;
            }

            result.name = userData[username].name;
            break;
        }
    }

    res.json(result);
});

router.post('/api/uploadcode', (req, res) => {
    const { group, names, datas, username, level } = req.body;
    console.log("RECEIVED " + names);

    if(!group || !names || !datas || !username) {
        res.end("FAILURE");
        return;
    }

    if(!(username in loginData)) {
        res.end("FAILURE");
        return;
    }

    var successes = 0;

    const now = new Date();
    now.setHours(now.getHours() - 7);

    var folderName = (now.toISOString().replace(":", ".").replace(":", ".") + "-" + username);
    fs.mkdirSync("userFilesHistory/group" + group + "/" + folderName);

    for(var i = 0; i < names.length; i++) {
        fs.writeFileSync("userFilesHistory/group" + group + "/" + folderName + "/" + names[i], datas[i]);
        fs.writeFile("userFiles/group" + group + "/" + names[i], datas[i], (err) => {
            if (err) {
                console.log("FAILURE");
                res.end("FAILURE");
                throw err;
            } else {
                successes++;
                console.log("SUCCESS " + successes + "/" + names.length);
                if(successes == names.length) {
                    res.end("SUCCESS");

                    updatePlugin(group, level);
                }
            }
        });
    }
});

router.post('/api/login', (req, res) => {
    var { username, password } = req.body;

    if(!username || !password) {
        setTimeout(() => {
            res.status(200).send({
                info: "FAILURE"
            });
        }, 1000);
        return;
    }

    console.log("Received a login request for " + username);

    if(username in loginData) {
        if(loginData[username].password === password) {
            console.log("Approving " + username + " with password.");
            res.status(200).send({
                info: "SUCCESS",
                password: loginData[username].cookiePassword
            });
        } else {
            if(loginData[username].cookiePassword === password) {
                console.log("Approving " + username + " with cookie password.");
                res.status(200).send({
                    info: "SUCCESS-COOKIE"
                });
            } else {
                console.log("Denying " + username + ".");
                setTimeout(() => {
                    res.status(200).send({
                        info: "FAILURE"
                    });
                }, 1000);
            }
        }
    } else {
        setTimeout(() => {
            console.log("Denying " + username + ". Username does not exist.");
            res.status(200).send({
                info: "FAILURE"
            });
        }, 1000);
    }
});

router.get('/api/onlinetest', (req, res) => {
    res.json({success: true});
});

function markAsWinPlugin(groupNumber) {
    const baseDirectory = path.resolve(__dirname, "../userFilesHistory/group" + groupNumber + "/");

    var files = fs.readdirSync(baseDirectory);

    var newestFile = null;
    var newestModifiedMilliseconds = 0;
    for(let i = 0; i < files.length; i++) {
        var file = files[i];
        var stats = fs.statSync(baseDirectory + file);

        if(newestFile === null || stats.mtime.getTime() > newestModifiedMilliseconds) {
            newestFile = file;
            newestModifiedMilliseconds = stats.mtime.getTime();
        }
    }

    if(newestFile !== null) {
        if(!newestFile.endsWith("-winner")) {
            fs.renameSync(baseDirectory + newestFile, baseDirectory + newestFile + "-winner");
        }
    }
}

router.post('/api/submitvictoryplugin', (req, res) => {
    const {
        groupNumber, key
    } = req.body;

    if(!groupNumber || !key) {
        res.status(200).send({
            info: "FAILURE"
        });
        return;
    }

    if(key !== "b25692cc-5bac-49b3-a90c-f05035d6644b") {
        res.status(200).send({
            info: "FAILURE"
        });
        return;
    }

    markAsWinPlugin(groupNumber)

    res.status(200).send({
        info: "SUCCESS"
    });
});

module.exports = router;