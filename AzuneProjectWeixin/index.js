// # Ghost bootloader
// Orchestrates the loading of Ghost
    // When run from command line.
var express = require('express');

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var stylus = require('stylus');
var hbs = require('express-hbs');
var helpers = require('./helpers');

//var routes = require('./routes');
//var user = require('./routes/user');


var app = express();
var curhbs = hbs.create();
// all environments
var por = process.env.PORT;
app.set('port', 1600);
app.engine('hbs', curhbs.express3({
    partialsDir: __dirname + '/views/partials'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Register helpers
helpers(curhbs);

// Middlewares
app.use(express.favicon());
app.use(express.logger('dev'));
// Parse the raw POST body
app.use(function (req, res, next) {
    req.rawBody = '';
    //req.setEncoding('utf8');
    req.on('data',function(d){req.rawBody+=d;});
    next();
});
app.use(express.json());
app.use(express.urlencoded());

//app.use(express.methodOverride());


app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use('/public/', express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    if (req.url.slice(-1) != '/') {
        req.url += '/';
    }
    next();

});
app.use(app.router);
    // static contents

    // development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes.api(app);
routes.admin(app);
app.get('/users', user.list);
app.get('/weixin/', routes.weixin);
app.post('/weixin/', routes.weixin);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


/*
console.log("here");
    var ghost = require('./core'),
    errors = require('./core/server/errorHandling');
    

ghost().otherwise(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});*/