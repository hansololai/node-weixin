var Backbone = require('backbone');
$ = require('jquery')(window);

Message = Backbone.Model.extend({
    initialize: function () {
        
    },
    defaults: {
        idMessage:0,
        FromUserName: '',
        ToUserName: '',
        Content: '',
        ReplyFor:0
    },
    restUrl:'/api/'

});
MessageCollection = Backbone.Collection.extend({
    model:Message,
});

module.exports = {Item:Message,List:MessageCollection};