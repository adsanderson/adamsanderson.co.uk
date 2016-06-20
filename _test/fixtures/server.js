const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')

// Serve up public/ftp folder
const serve = serveStatic('public');

// Create server
const server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res));
});

function listen (cb) {
    const PORT = process.env.PORT || 3011;
    const IP = process.env.IP;
    // Listen
    server.listen(PORT, IP,  cb);
}

function cancel () {
    server.close();
}

module.exports = {
    listen: listen,
    cancel: cancel
};