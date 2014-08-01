var Backbone = require('backbone');
$ = require('jquery');
Backbone.$ = $;

var Message = Backbone.Model.extend({
    initialize: function () {
        
    },
    defaults: {
        idMessage:0,
        FromUserName: '',
        ToUserName: '',
        Content: '',
        ReplyFor:0
    },
    restUrl:'/api/message'

});
var MessageCollection = Backbone.Collection.extend({
    model: Message,
    url: '/api/message'
});

module.exports = {Item:Message,List:MessageCollection};