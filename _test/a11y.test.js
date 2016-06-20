const a11y = require('a11y');
const server = require('./fixtures/server');

server.listen(() => {
  const IP = process.env.IP || 'localhost';
  const PORT = process.env.PORT || '8080';
  a11y(`${IP}:${PORT}`, function (err, reports) {
      var audit = reports.audit; // a11y Formatted report
      var report = reports.report; // DevTools Accessibility Audit formatted report
      console.log(report);
      server.close();
  });
});