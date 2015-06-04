var http = require('http');

var crashed = false;

function fail(res){

  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Goodbye Cruel World\n');
}

function success(res){
  console.log("YO")
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}

function crash(){
  crashed = true;
  
  var reset = Math.floor( (Math.random() * 20000) + 30 );
  console.error("api server 'crashed'!!", "reset in ", reset, " (", new Date( Date.now() + reset ), " )");

  setTimeout(function(){
    crashed = false;
    console.info("api server reset after ", reset);
  }, Math.floor( (Math.random() * 20000) + 30 ) );
}



http.createServer(function (req, res) {
  
  var failChance = Math.floor( (Math.random() * 4) + 1 );

  if ( failChance === 4 || crashed) {
    if(!crashed){
      var crashChance = Math.floor( (Math.random() * 4) + 1 );
      if ( crashChance === 4) {
        crash();
      }
    }

    fail(res);
  }
  else {
    success(res);
  }

}).listen(process.env.PORT || '3000', "127.0.0.1");

console.log('Server running at http://127.0.0.1:', process.env.PORT || '3000');
