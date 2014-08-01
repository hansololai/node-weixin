var apicontroller = require('../controllers/restAPI');
function api(server) {
    server.get('/api/message/:id', apicontroller.Message.get);
    server.post('/api/message/', apicontroller.Message.create);
    server.put('/api/message/:id', apicontroller.Message.update);
    server.get('/api/message/', apicontroller.Message.all);
    server.delete('/api/message/:id', apicontroller.Message.del);
}
module.exports = api;