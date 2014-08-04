Message = {
    get: function (req, res) {
        console.log(req.params.id);
        res.send({
            idMessage: 1,
            FromUserName: 'myname',
            ToUserName: 'yourname',
            Content: 'whatever', 
            ReplyFor: 0
        });
    },
    create: function (req, res) {
        res.send({
            "createdAt": "2011-08-21T18:02:52.248Z"
        });
    },
    update: function (req, res) {
        res.send({
            "updatedAt": "2011-08-21T18:02:52.248Z"
        });
    },
    all: function (req, res) {
        var toReturn = [
            {
            idMessage: 1,
            FromUserName: 'myname',
            ToUserName: 'yourname',
            Content: 'whatever', 
            ReplyFor: 0
        },{
            idMessage: 2,
            FromUserName: 'myname2',
            ToUserName: 'yourname2',
            Content: 'whatever2',
            ReplyFor: 0
        }
            ];
        res.send(toReturn);
    },
    del: function (req, res) { },
    allReply: function (req, res) { 
        var toReturn = [
            {
            idMessage: 1,
            FromUserName: 'me',
            ToUserName: 'yourname',
            Content: 'whatever', 
            ReplyFor: 0
        },{
            idMessage: 2,
            FromUserName: 'me',
            ToUserName: 'yourname2',
            Content: 'whatever2',
            ReplyFor: 0
        }
            ];
        res.send(toReturn);
    }
};
Keyword = {
    get: function (req, res) {
        console.log(req.params.id);
        res.send({
            idKeywordReply: 1,
            Keyword: 'testkeyword',
            RegularReply: {
                idReplyMaterial: 0,
                CreateTime: '2011-08-21T18:02:52.248Z',
                MsgType: 'text',
                Title: 'test regular reply',
                Data: null
            },
            MemberReply: {}
        });
    },
    create: function (req, res) {
        res.send({
            "createdAt": "2011-08-21T18:02:52.248Z"
        });
    },
    update: function (req, res) {
        res.send({
            "updatedAt": "2011-08-21T18:02:52.248Z"
        });
    },
    all: function (req, res) {
        var toReturn = [
            {
            idKeywordReply: 2,
            Keyword: 'testkeyword1',
            RegularReply: {
                idReplyMaterial: 0,
                CreateTime: '2011-08-21T18:02:52.248Z',
                MsgType: 'text',
                Title: 'test regular reply1',
                Data: null
            },
            MemberReply: {}
            },{
            idKeywordReply: 3,
            Keyword: 'testkeyword2',
            RegularReply: {
                idReplyMaterial: 0,
                CreateTime: '2011-08-21T18:02:52.248Z',
                MsgType: 'news',
                Title: 'test regular reply2',
                Data: null
            },
            MemberReply: {}
            }
            ];
        res.send(toReturn);
    },
    del: function (req, res) { },
};
ReplyMaterial = {
    get: function (req, res) {
        console.log(req.params.id);
        res.send({
            idReplyMaterial:1,
            CreateTime: '2011-08-21T18:02:52.248Z',
            MsgType: 'text',
            Title: 'test regular reply',
            Data: [{
                idPicMaterial: 1,
                Title:'title in weixin',
                Description: 'describe',
                PicUrl: 'http://picture.com/',
                Url: 'http://picture.com/big'
            }]
        });
    },
    create: function (req, res) {
        res.send({
            "createdAt": "2011-08-21T18:02:52.248Z"
        });
    },
    update: function (req, res) {
        res.send({
            "updatedAt": "2011-08-21T18:02:52.248Z"
        });
    },
    all: function (req, res) {
        var toReturn = [
            {
            idReplyMaterial: 1,
            CreateTime: '2011-08-21T18:02:52.248Z',
            MsgType: 'news',
            Title: 'test regular reply1',
            Data: [{
                idPicMaterial: 1,
                Title: 'title in weixin',
                Description: 'describe',
                PicUrl: 'http://picture.com/',
                Url: 'http://picture.com/big'
            }]
        },{
            idReplyMaterial: 2,
            CreateTime: '2011-08-21T18:02:52.248Z',
            MsgType: 'news',
            Title: 'test regular reply2',
            Data: [{
                idPicMaterial: 1,
                Title: 'title in weixin',
                Description: 'describe',
                PicUrl: 'http://picture.com/',
                Url: 'http://picture.com/big'
            }]
        }
            ];
        res.send(toReturn);
    },
    del: function (req, res) { },

};
module.exports = {
    Message: Message,
    Keyword: Keyword,
    ReplyMaterial: ReplyMaterial
}; 