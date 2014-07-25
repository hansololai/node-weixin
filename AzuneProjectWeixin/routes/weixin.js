var xml = require('xmldoc');
var textHandle = require('../queryHandler');
var Q = require('q');


var TOKEN = 'weixin';
module.exports.call=function responseToRequest(req, res) {
    console.log(req.param('echoStr'));
    console.log(req.query);
    console.log(req.body);
    console.log(req.rawBody);
    var echoStr = req.param('echoStr');
    if (echoStr !== undefined) {
        validation(req, res);
    } else if (req.rawBody !== '') {
        Respond(req, res);
    } else {
        res.send("No result");
    }
}

function validation(req, res) {
    var crypto = require('crypto');
    var sha = crypto.createHash('sha1');
 
    var echoStr = req.param('echostr');
    var signiture = req.param('signature');
    var timestamp = req.param('timestamp');
    var nonce = req.param('nonce');
    var col=[TOKEN,timestamp,nonce];
    col = col.sort();
    var toBeValidated = col.join('');
    sha.update(toBeValidated);
    var toReturn = sha.digest('hex');
    if (toReturn === signiture) {
        res.send(echoStr); //valid
    } else {
        res.send('');//not valid, return blank!
    }
}

function Respond(req, res) {
    // Parse the xml body. 
    var clientMsg = new xml.XmlDocument(req.rawBody);
    
    var myOpenId = clientMsg.childNamed('ToUserName').val;
    var cOpenId = clientMsg.childNamed('FromUserName').val;
    var msgType = clientMsg.childNamed('MsgType').val;

    if (msgType === 'text') {
        var content = clientMsg.childNamed('Content');
        textHandle(false, content, req, res).then(function (data) { res.send(buildReplyMessage('text', data, myOpenId, cOpenId)); }, function (err) {
            var errMsg = buildReplyMessage('text', err, myOpenId, cOpenId);
            // res.send();
            res.send(errMsg);
        });
    } else {
        res.send(buildReplyMessage('text', 'I can only handle text message right now', myOpenId, cOpenId));
    }
}
    /*************************Database insert******************************/
function saveMessage(db,fromUser, toUser, cTime, content) {

}








    /**********************************************************************/
    /***********************Reply Message Wrapper**************************/
    /**********************************************************************/

function uploadMedia(formData, token) {
    var defered = Q.defer();
    var http = require('http');
    var options = { host: 'https://api.weixin.qq.com', path: '/cgi-bin/media/uploadnews?access_token=' + token, method: 'POST' };
    callback = function (response) {
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var obj = JSON.parse(str);
            if (obj.error) {
                defered.reject(obj);
            } else {
                defered.resolve(obj);
            }
        });
    }
    var postreq = http.request(options, callback);
    postreq.write(JSON.stringify(formData));
    postreq.end();
    return defered.promise;
}
function buildGroupMessage(requestUrl, token, Data) {
    var defered = Q.defer();
    var articles = [];
    var formData = {'articles':articles};
    
    for (item in Data) {
        var article = { 'thumb_media_id': Data.mediaId, 'author': Data.author, 'title': Data.title, 'content_source_url': Data.url, 'content': Data.content, 'digest': Data.digest, 'show_cover_pic': Data.show };
        articles += article;
    }
    var requestPromise = uploadMedia(formData, token).then(function (data) { defered.resolve(data); }, function (err) { defered.reject(err); });
    defered.promise;
}


function buildReplyMessage(type, text, fromUser, toUser, data) {
    var header='<xml><ToUserName><![CDATA[' + toUser + ']]></ToUserName><FromUserName><![CDATA[' + fromUser + ']]></FromUserName><CreateTime>12345678</CreateTime><MsgType><![CDATA['+type+']]></MsgType>';
    var footer = '<FuncFlag>0</FuncFlag></xml>';
    var content;
    if (type === 'text') {
        content = buildTextMessage(text);
    } else if(type==='news'){
        content = buildNewsMessage(data);
    } else if (type === 'music') {
        content = buildMusicMessage(data);
    } else {
        content = buildTextMessage('Incorrect message type');
    }
    var toReturn = header + content + footer;
    return toReturn;
}
function buildTextMessage(data) {
    var toReturn = '<Content><![CDATA[' + data + ']]></Content>';
    return toReturn;
}
function buildNewsMessage(data) {
    var toReturn = '';
    var content = '<Articles>';
    var count = 0;
    for (item in data) {
        count++;
        content += '<item><Title><![CDATA['+item.title+']]></Title> <Description><![CDATA['+item.description+']]></Description><PicUrl><![CDATA['+item.picUrl+']]></PicUrl><Url><![CDATA['+item.url+']]></Url></item>';
    }
    var header = '<ArticleCount>' + count + '</ArticleCount>';
     content+= ' </Articles>';
    toReturn = header + content;
    return toReturn;
}
function buildMusicMessage(data) {
    var toReturn = '';
    var content = '<Music> <Title><![CDATA['+data.title+']]></Title><Description><![CDATA['+data.description+']]></Description><MusicUrl><![CDATA['+data.musicUrl+']]></MusicUrl><HQMusicUrl><![CDATA['+data.hqMusicUrl+']]></HQMusicUrl></Music>';
}

