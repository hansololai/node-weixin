var apicontroller = require('../controllers/restAPI');
function api(server) {
    server.get('/api/message/:id', apicontroller.Message.get);
    server.post('/api/message/', apicontroller.Message.create);
    server.put('/api/message/:id', apicontroller.Message.update);
    server.get('/api/message/', apicontroller.Message.all);
    server.delete('/api/message/:id', apicontroller.Message.del);
    // Text reply for message
    server.get('/api/replyMessage/:id', apicontroller.Message.allReply);    
    server.post('/api/replyMessage/', apicontroller.Message.create);
    server.put('/api/replyMessage/:id', apicontroller.Message.update);
    // Keyword-Reply set
    server.get('/api/keyword/:id', apicontroller.Keyword.get);
    server.get('/api/keyword/', apicontroller.Keyword.all);
    server.put('/api/keyword/', apicontroller.Keyword.update);

    server.get('/api/replymaterial/:id', apicontroller.ReplyMaterial.get);
    server.get('/api/replymaterial/', apicontroller.ReplyMaterial.all);
}
module.exports = api;