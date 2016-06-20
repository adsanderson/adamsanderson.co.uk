const server = require('./fixtures/server');

console.log('test test test');

server.listen(() => {
  // setTimeout(() => {
  //   console.log('timeout')
  //   server.cancel();
  // }, 1000);
});


// phantom.exit(0);

// var page = require('webpage').create();

// page.viewportSize = {
//   width: 480,
//   height: 800
// };

// page.onResourceRequested = function(request) {
//   console.log('Request ' + JSON.stringify(request.url, undefined, 4));
// };
// page.onResourceReceived = function(response) {
//   console.log('Receive ' + JSON.stringify(response.url, undefined, 4));
// };

// page.open('http://adamsandersoncouk.lazydayed.c9users.io/', function(status) {
//   console.log("Status: " + status);
//   // console.log(page.content);
//   if(status === "success") {
//     page.render('example.png');
//   }
//   phantom.exit();
// });