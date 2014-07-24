var xml = require('xmldoc');
var textHandle=require('QueryHandler/textHandler');


var TOKEN = 'weixin';
module.exports.call=function responseToRequest(req, res) {
    console.log(req.param('echoStr'));
    console.log(req.query);
    console.log(req.body);
    console.log(req.rawBody);
    var echoStr = req.param('echoStr');
    if (echoStr !== undefined) {
        validation(req, res);
    } else if(req.rawBody!=='') {
        Respond(req, res);
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
    
    var myOpenId = clientMsg.childNamed('ToUserName');
    var cOpenId = clientMsg.childNamed('FromuserName');
    var msgType = clientMsg.childNamed('MsgType');

    if (msgType === 'text') {
        var content = clientMsg.childNamed('Content');
        textHandle(content, req, function (reply) { res.send(reply);});
    }
    res.send(buildReplyMessage('text','I can only handle text message right now',''));
    


}

function buildReplyMessage(type, text, url) {
    return text;
}



