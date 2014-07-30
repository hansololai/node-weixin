var $ = require('jquery')(window);
var Backbone = require('backbone');
var tpMsgPane = require('./template/message.hbs');
var tpSidebar = require('./template/sidebar.hbs');
var tpGeneral = require('./template/general.hbs');
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
    render: function () {
        this.sidebar.render();
        this.sidebar.renderPane();
        this.$el.html(tpMsgPane(this.collection.toJSON()));
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
    render: function () {
        this.$el.html(tpSidebar());
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
Pane = Backbone.View.extend({
    destroy: function () {
        this.$el.removeClass('active');
        this.undelegateEvents();
    },
    render: function () {
        this.$el.hide();
        this.$el.html();
        this.$el.fadeIn(300);
    },
    afterRender: function () {
        this.$el.attr('id', this.id);
        this.$el.addClass('active');
    },
    saveSuccess: function (model, response, options) {
        /*jshint unused:false*/
        Ghost.notifications.clearEverything();
        Ghost.notifications.addItem({
            type: 'success',
            message: 'Saved',
            status: 'passive'
        });
    },
    saveError: function (model, xhr) {
        /*jshint unused:false*/
        Ghost.notifications.clearEverything();
        Ghost.notifications.addItem({
            type: 'error',
            message: Ghost.Views.Utils.getRequestErrorMessage(xhr),
            status: 'passive'
        });
    },
    validationError: function (message) {
        Ghost.notifications.clearEverything();
        Ghost.notifications.addItem({
            type: 'error',
            message: message,
            status: 'passive'
        });
    }
});
    // ### General settings
Settings.general = Settings.Pane.extend({
    id: "general",

    events: {
        'click .button-save': 'saveSettings',
        'click .js-modal-logo': 'showLogo',
        'click .js-modal-cover': 'showCover'
    },

    saveSettings: function () {
        var self = this,
            title = this.$('#blog-title').val(),
            description = this.$('#blog-description').val(),
            email = this.$('#email-address').val(),
            postsPerPage = this.$('#postsPerPage').val(),
            permalinks = this.$('#permalinks').is(':checked') ? '/:year/:month/:day/:slug/' : '/:slug/',
            validationErrors = [];

        if (!validator.isLength(title, 0, 150)) {
            validationErrors.push({ message: "Title is too long", el: $('#blog-title') });
        }

        if (!validator.isLength(description, 0, 200)) {
            validationErrors.push({ message: "Description is too long", el: $('#blog-description') });
        }

        if (!validator.isEmail(email) || !validator.isLength(email, 0, 254)) {
            validationErrors.push({ message: "Please supply a valid email address", el: $('#email-address') });
        }

        if (!validator.isInt(postsPerPage) || postsPerPage > 1000) {
            validationErrors.push({ message: "Please use a number less than 1000", el: $('postsPerPage') });
        }

        if (!validator.isInt(postsPerPage) || postsPerPage < 0) {
            validationErrors.push({ message: "Please use a number greater than 0", el: $('postsPerPage') });
        }


        if (validationErrors.length) {
            validator.handleErrors(validationErrors);
        } else {
            this.model.save({
                title: title,
                description: description,
                email: email,
                postsPerPage: postsPerPage,
                activeTheme: this.$('#activeTheme').val(),
                permalinks: permalinks
            }, {
                success: this.saveSuccess,
                error: this.saveError
            }).then(function () { self.render(); });
        }
    },
    showLogo: function (e) {
        e.preventDefault();
        var settings = this.model.toJSON();
        this.showUpload('logo', settings.logo);
    },
    showCover: function (e) {
        e.preventDefault();
        var settings = this.model.toJSON();
        this.showUpload('cover', settings.cover);
    },
    showUpload: function (key, src) {
        var self = this,
            upload = new Ghost.Models.uploadModal({
                'key': key, 'src': src, 'id': this.id, 'accept': {
                    func: function () { // The function called on acceptance
                        var data = {};
                        if (this.$('.js-upload-url').val()) {
                            data[key] = this.$('.js-upload-url').val();
                        } else {
                            data[key] = this.$('.js-upload-target').attr('src');
                        }

                        self.model.save(data, {
                            success: self.saveSuccess,
                            error: self.saveError
                        }).then(function () {
                            self.saveSettings();
                        });

                        return true;
                    },
                    buttonClass: "button-save right",
                    text: "Save" // The accept button text
                }
            });

        this.addSubview(new Ghost.Views.Modal({
            model: upload
        }));
    },
    render: function () {
        this.$el.html(tplGeneral());
    },

    afterRender: function () {
        var self = this;

        this.$('#permalinks').prop('checked', this.model.get('permalinks') !== '/:slug/');
        this.$('.js-drop-zone').upload();

        Countable.live(document.getElementById('blog-description'), function (counter) {
            var descriptionContainer = self.$('.description-container .word-count');
            if (counter.all > 180) {
                descriptionContainer.css({ color: "#e25440" });
            } else {
                descriptionContainer.css({ color: "#9E9D95" });
            }

            descriptionContainer.text(200 - counter.all);

        });

        Settings.Pane.prototype.afterRender.call(this);
    }
});