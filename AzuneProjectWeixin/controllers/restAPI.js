Message = {
    get: function (req, res) { },
    create: function (req, res) { },
    update: function (req, res) { },
    all: function (req, res) {
        var toReturn =[
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
    delete: function (req, res) { }
};

module.exports = {
    Message:Message
}; 