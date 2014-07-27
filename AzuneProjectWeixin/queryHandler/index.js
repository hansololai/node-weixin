var Q = require('q');
var dbobj = require('./database');

    /*
    * Handle a text message and return a built xml message.
    */
var database;
function mainHandler(premium, txtMsg, req, res) {
    var defered = Q.defer();
    var db = req.db;
    keywordMatch(req, res, premium, txtMsg).then(function (data) { defered.resolve(data); }, function (err) { defered.reject(err);});
    return defered.promise;
   
}

function keywordMatch(req, res, premium, txtMsg) {
    
    var defered = Q.defer();
    var reply = function (data) {
        if (data) {
            defered.resolve(data);
        } else {
            defered.reject("no data");
        }
    }

    dbobj.Reply.get(txtMsg, premium).then(function (data) {
        var type = data.MsgType;
        var toReturn = {MsgType:type};
        if (type === 'text') {
            toReturn.Data=data;
            defered.resolve(toReturn);
        } else {
            var id = data.MediaKey;
            dbobj.Mat.get(type, id).then(function (row) {
                toReturn.Data = row;
                defered.resolve(toReturn);
            });
        }
        
    });
    return defered.promise;
}

module.exports = mainHandler;
