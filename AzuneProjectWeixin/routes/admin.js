var admin=require('../controllers/admin');

module.exports = function (server) {
    server.get('/admin/setting/:subitem/?', admin.setting);
}
