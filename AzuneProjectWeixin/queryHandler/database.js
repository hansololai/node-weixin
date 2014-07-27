/**
 * New node file
 */
 var sqlite = require('sqlite3').verbose();
var db;
var Q=require('q');
function init(){
	if(!db)
	db = new sqlite.Database("../Data/data.dat");
}


function dbOperation(sql, op) {
    var defered = Q.defer();
    if (!op) { defered.reject('no operation'); }
    if (op === 'get') {
        db.all(sql, function (err, row) {
            if (err) {
                defered.reject(err);
            } else {
                defered.resolve(row);
            }
        })
    } else if (op === 'modify') {
        db.run(sql, function (err) {
            if (err) {
                defered.reject(err);
            } else {
                defered.resolve('modify success');
            }
        })
    }
    return defered.promise;
}
Message = {
    add:function(item){
        var defered = Q.defer();
        var sql = 'insert into Messages (NULL,' + item.FromUserName + ',' + item.ToUserName + ',' + item.Content + ',0);';
        dbOperation(sql, 'modify').then(function (data) { if (data) defered.resolve(data); else defered.reject("Insertion failed"); });
        return defered.promise;
    },
    get:function(id){
	   
    },
    setReplied: function (){
	
    }
}
Member = {
    add: function (SimId,UserData) {
        
    },
    set: function (FromUserName) {
    },
    is: function (FromUserName) {
        var defered = Q.defer();
        var sql = 'select name from PremiumUser where OpenID=' + FromUserName + ';';
        dbOperation(sql, 'get').then(function (data) { defered.resolve(1); }, function (err) { defered.resolve(0);});
        return defered.promise;
    }
}
function uploadMedia(){
	
}
Reply = {
    get: function(keyword, membership) {
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
        var regular = dbOperation('select ReplyMaterial.* from KeywordReply left join ReplyMaterial on KeywordReply.regularReplyID=ReplyMaterial.idReplyMaterial where Keyword=' + keyword + ' limit 1', 'get');
        if (membership) {
            dbOperation('select ReplyMaterial.* from KeywordReply left join ReplyMaterial on KeywordReply.premiumReplyID=ReplyMaterial.idReplyMaterial where Keyword=' + keyword + ' limit 1', 'get').then(function (data) {
                if (data) {
                    defered.resolve(data);
                } else {
                    regular.then(reply);
                }
            });
        } else {
            regular.then(reply, function (err) { defered.reject(err); });
        }

        return defered.promise;
    },
    add: function (item) {
        var defered = Q.defer();
        var sql = 'insert into KeywordReply (NULL,' + item.Keyword + ',';
        if (item.premiumReplyID) {
            sql += item.premiumReplyID + ',';
        } else {
            sql += 'NULL,';
        }
        
        if (item.regularReplyID) {
            sql += item.regularReplyID + ')';
        } else {
            sql += 'NULL)';
        }
        dbOperation(sql, 'modify').then(function (data) { if (data) defered.resolve(data); else defered.reject("Insertion failed"); });
        return defered.promise;
    },
    update: function () {
    }
}
Material = {
    get: function (type, id) {
        var defered = Q.defer();
        var sql = '';
        if (type = 'music') {
            sql = 'select * from MusicMaterial where idMusicMaterial=' + id + ';';
        } else if (type = 'pic') {
            sql = 'select * from PicMaterial where idPicMaterial=' + id + ';';
        } else {
            defered.reject('incorrect Material type');
        }
        dbOperation(sql, 'get').then(function (data) {
            if (data) {
                defered.resolve(data);
            } else {
                defered.reject('no media');
            }
        });
        return defered.promise;
    },
    add: function (item) {
        var defered = Q.defer();
        var sql = 'insert into '; 
        if (item.type === 'music') {
            sql += 'MusicMaterial values(NULL,' + item.Title + ',' + item.Description + ',' + item.MusicUrl + ',' + item.HQMusicUrl + ');';
        } else if (item.type === 'news') {
            sql += 'PicMaterial values(NULL,' + item.Title + ',' + item.Description + ',' + item.PicUrl + ',' + Url + ');';
        } else {
            defered.reject('incorrect Material type');
        }
        dbOperation(sql, 'modify').then(function (data) { if (data) defered.resolve(data); else defered.reject("Insertion failed"); });
    },
    update: function () {
    }
}
Fans = {
    get: function () {
    },
    update:function(){
    }
}
var databaseFunctions = {
    Msg: Message,
    Mem: Member,
    Reply: Reply,
    Mat: Material
};

module.exports = databaseFunctions;
