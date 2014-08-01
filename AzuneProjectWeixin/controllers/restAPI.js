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
    create: function (req, res) { },
    update: function (req, res) { 
    	res.send({
			"updatedAt": "2011-08-21T18:02:52.248Z"
		});
    },
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
    del: function (req, res) { }
};

module.exports = {
    Message:Message
}; 