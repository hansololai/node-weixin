// # Ghost bootloader
// Orchestrates the loading of Ghost
    // When run from command line.
var express = require('express');

var routes = require('./routes');
var weixin = require('./routes/weixin');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var stylus = require('stylus');
var hbs = require('express-hbs');
var helpers = require('./helpers');
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database("./Data/data.dat");
//var routes = require('./routes');
//var user = require('./routes/user');


var app = express();
    // all environments
app.set('port', process.env.PORT || 3000);
app.engine('hbs', hbs.express3({
    partialsDir: __dirname + '/views/partials'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Register helpers
helpers(hbs);

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
app.use(express.methodOverride());
app.use(function (req, res,next) {
    req.db = db;
    next();
});
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

    // development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/weixin/', weixin.call);
app.post('/weixin/', weixin.call);

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