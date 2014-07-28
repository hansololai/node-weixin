
hbs = require('express-hbs');
function mainHelper(hbsInstance) {
    hbsInstance.registerHelper('link', function (text, options) {
        var attrs = [];
        for (var prop in options.hash) {
            attrs.push(prop + '="' + options.hash[prop] + '"');
        }
        return new hbs.SafeString(
          "<a " + attrs.join(" ") + ">" + text + "</a>"
        );
    });
    hbsInstance.registerHelper('txtBoxes', function (txtArray) { });
    hbsInstance.registerHelper('asset', function (link,options) {
        var output = '/public/assets/' + link;
        var toreturn =new hbs.handlebars.SafeString(output);
        return toreturn;
    });
}

module.exports = mainHelper;