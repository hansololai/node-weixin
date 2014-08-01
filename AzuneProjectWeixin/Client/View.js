"use strict";
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$=$;
//var myApp=global.myApp;
var tpMsgPane = require('./template/message.hbs');
var tpSidebar = require('./template/sidebar.hbs');
var tpGeneral = require('./template/general.hbs');
var Msg = require('./models');
var Settings={};
var SettingView = Backbone.View.extend({
    initialize: function (options) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            model:this.model
        });
        this.listenTo(myApp.router, 'route:settings', this.changePane);
        
    },
    changePane: function (pane) {
        if (!pane) {
            return;
        }
        this.sidebar.showContent(pane);
    },
    render: function () {
        this.sidebar.render();
//        if(!this.sidebar.pane)
//        	this.showContent('general');
//        else
//        	this.sidebar.renderPane({});
    }
    
});
var Sidebar = Backbone.View.extend({
    initialize: function (options) {
    	
    	this.el=options.el;
        this.render();

        this.menu = this.$('.settings-menu');
    },
    models: {},
    events: {
        'click .settings-menu li': 'switchPane'
    },
    render: function () {
//    	for (item in this.$el){
//    		alert(item+" "+this.$el[item]);
//    	}
    	//this.el.html(tpSidebar());
    
        //$(this.el).html("bb");
        var ml = tpSidebar({});
        ml=ml.substring(1);
        this.$el.html('');
       this.$el.html(ml);
    	return this;
    },
    switchPane: function (e) {
        e.preventDefault();
        var item = $(e.currentTarget),
            id = item.find('a').attr('href').substring(1);
        
        this.showContent(id);
    },

    showContent: function (id) {
        
        
        var self = this,
            model;
        myApp.router.navigate('/settings/' + id + '/');
        //myApp.trigger('urlchange');
        if (this.pane && id === this.pane.id) {
            return;
        }
        if(this.pane)
        this.pane.destroy();
        this.setActive(id);
        var toDisplay=Settings[id];
        if(toDisplay){
        	this.pane =new toDisplay({ el: '.settings-content' }); 
        }else{
        	this.pane=new Settings.Pane({ el: '.settings-content' });
        }
        this.pane.render();
        
//
//        if (!this.models.hasOwnProperty(this.pane.options.modelType)) {
//            model = this.models[this.pane.options.modelType] = new Ghost.Models[this.pane.options.modelType]();
//            model.fetch().then(function () {
//                self.renderPane(model);
//            });
//        } else {
//            model = this.models[this.pane.options.modelType];
//            self.renderPane(model);
//        }
    },

    renderPane: function (model) {
        this.pane.model = model;
        this.pane.render();
    },

    setActive: function (id) {
    	this.menu = this.$('.settings-menu');
        this.menu.find('li').removeClass('active');
        var submenu= this.menu.find('.submenu');
        for (var i = 0; i < submenu.length; i++) {
            submenu[i].style.display = 'none';
        }
        this.menu.find('a[href=#' + id + ']').parent().addClass('active');
        var ind = id.indexOf('_');
        var frameID;
        //It is a submenu, first make the submenu display
        if (ind > 0) {
            frameID= id.substring(0, ind);
        } else {
            frameID = id;
        }
        if (this.menu.find('#' + frameID).length>0) {
            this.menu.find('#' + frameID)[0].style.display = 'block';
        } 
        
    }
});
Settings.Pane = Backbone.View.extend({
    destroy: function () {
        this.$el.removeClass('active');
        this.undelegateEvents();
    },
    
    render: function () {
        this.$el.hide();
        this.$el.html("Selected pane does not exist");
        this.$el.fadeIn(300);
    },
    afterRender: function () {
    	
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    },
    saveSuccess: function (model, response, options) {
        /*jshint unused:false*/
//        Ghost.notifications.clearEverything();
//        Ghost.notifications.addItem({
//            type: 'success',
//            message: 'Saved',
//            status: 'passive'
//        });
    },
    saveError: function (model, xhr) {
        /*jshint unused:false*/
//        Ghost.notifications.clearEverything();
//        Ghost.notifications.addItem({
//            type: 'error',
//            message: Ghost.Views.Utils.getRequestErrorMessage(xhr),
//            status: 'passive'
//        });
    },
    validationError: function (message) {
//        Ghost.notifications.clearEverything();
//        Ghost.notifications.addItem({
//            type: 'error',
//            message: message,
//            status: 'passive'
//        });
    }
});
    // ### General settings
 Settings.general = Settings.Pane.extend({
    id: "general",
//    events: {
//        'click .button-save': 'saveSettings',
//        'click .js-modal-logo': 'showLogo',
//        'click .js-modal-cover': 'showCover'
//    },
    render: function () {
        var ml = tpGeneral();
        
        this.$el.html(ml);
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    }
});
Settings.messages = Settings.Pane.extend({
    id: "messages",
    initialize: function (options){
        if (options.collection) {
            this.collection = options.collection;
        }else if (!this.collection||this.collection.length<1) {
            this.collection = new Msg.List();
            this.collection.fetch({reset:true});
        }
        
        this.collection.on("reset", this.render, this);
    },

    render: function () {
        	var self=this;
        	var data=self.collection?self.collection.toJSON():{};
            var ml = tpMsgPane({ message: data });
            if (ml[0] != '<') {
                ml = ml.substring(1);
            }
            self.$el.html(ml);
            self.$el.attr('id', this.id);
            self.$el.addClass('active');

            self.$el.append('<div>test</div>');
        console.log(this.collection);
    }
});
module.exports={
		Setting:SettingView,
		Sidebar:Sidebar,
		Panes:Settings,
};