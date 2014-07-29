var $ = require('jquery')(window);
var Backbone = require('backbone');
var template = require('./template/message.hbs');

SettingView = Backbone.View.extend({
    initialize: function (option) {
        $(".settings-content").removeClass('active');
        this.sidebar = new Sidebar({
            el: '.settings-sidebar',
            pane: options.pane,
            model:this.model
        });
        this.listenTo(router, 'route:settings', this.changePane);
    },
    changePane: function (pane) {
        if (!pane) {
            return;
        }
        this.sidebar.showContent(pane);
    },
    render: function(){
        this.$el.html(template(this.collection.toJSON()));
    }
    
});
Sidebar = Backbone.View.extend({
    initialize: function (option) {
        this.render();
        this.menu = this.$('.settings-menu');
        this.showContent(options.pane);
    },
    models: {},
    events: {
        'click .settings-menu li': 'switchPane'
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

        Ghost.router.navigate('/settings/' + id + '/');
        Ghost.trigger('urlchange');
        if (this.pane && id === this.pane.id) {
            return;
        }
        _.result(this.pane, 'destroy');
        this.setActive(id);
        this.pane = new Settings[id]({ el: '.settings-content' });

        if (!this.models.hasOwnProperty(this.pane.options.modelType)) {
            model = this.models[this.pane.options.modelType] = new Ghost.Models[this.pane.options.modelType]();
            model.fetch().then(function () {
                self.renderPane(model);
            });
        } else {
            model = this.models[this.pane.options.modelType];
            self.renderPane(model);
        }
    },

    renderPane: function (model) {
        this.pane.model = model;
        this.pane.render();
    },

    setActive: function (id) {
        this.menu.find('li').removeClass('active');
        this.menu.find('a[href=#' + id + ']').parent().addClass('active');
    }
});