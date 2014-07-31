(function(){
	var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
global.myApp={
		Views:{},
		Models:{},
		Collections:{},
		router:null
	};
var Router=require('./Router');
var Models=require('./models');
var View=require('./View');

var init=function(){
	myApp.router=new Router();
	Backbone.history.start({
		pushState:true,
		hashChange:false,
        root: '/admin'
	});
};
init();

}());