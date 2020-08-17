const mongoose = require('mongoose');

function registerGroupLogSchema(groupNum) {
    const logSchema = new mongoose.Schema({
        content: String,
        createdAt: {
            type: Date,
            expiresAfterSeconds: 86400,
            default: Date.now
        }
    }, {collection: 'logGroup' + groupNum});
    
    module.exports = mongoose.model('LogGroup' + groupNum, logSchema);
}

//TODO: edit this if you want to have more or less groups
var MAX_GROUPS = 8;

for(var i = 1; i <= MAX_GROUPS; i++) {
    registerGroupLogSchema(i);
}