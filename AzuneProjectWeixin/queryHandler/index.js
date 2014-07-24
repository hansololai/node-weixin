var Q = require('q');

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
    //Check database for keyword entry
    database = req.db;
    var regular = dbrun('select * from KeywordReply left join ReplyMaterial on KeywordReply.premiumReplyID=ReplyMaterial.idReplyMaterial where Keyword=' + txtMsg + ' limit 1',database);
    if (premium) {
        dbrun('select * from KeywordReply left join ReplyMaterial on KeywordReply.premiumReplyID=ReplyMaterial.idReplyMaterial where Keyword=' + txtMsg + ' limit 1',database).then(function (data) {
            if (data) {
                defered.resolve(data);
            } else {
                regular.then(reply);
            }
        });
    } else {
        regular.then(reply, function (err) { defered.reject(err);});
    }
    
    return defered.promise;
}


function dbrun(sql,database) {
    var defered = Q.defer();
    database.all(sql, function (err, row) {
        if (err) {
            defered.reject(err);
        } else {
            defered.resolve(row);
        }
    })
    return defered.promise
}


module.exports = mainHandler;
