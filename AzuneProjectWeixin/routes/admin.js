var admin=require('../controllers/admin');

module.exports = function (server) {
    server.get('/admin/settings/:subitem/?', admin.setting);
}
