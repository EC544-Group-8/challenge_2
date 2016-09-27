var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db');
var SerialPort = require("serialport");

var portName = process.argv[2],
portConfig = {
  baudRate: 115200,
  parser: SerialPort.parsers.readline("\n")
};
var sp;
sp = new SerialPort.SerialPort(portName, portConfig);

var routes = require('./routes/index');
var measurements = require('./routes/measurements');
var heatmap = require('./routes/heatmap');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/measurements', measurements);
app.use('/heatmap', heatmap);


// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.');
    process.exit(1);
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...');
    });
  }
});

// ---- BEGIN XBee communication ----- //
var Tempcontroller = require('./models/tempcontroller.js');
var ping_index = 0;
var pings = ['a', 'b', 'c', 'd'];

// When the controller xBee's serialport is filled, parse the data
sp.on("open", function () {
  console.log('open');
  sp.on('data', function(data) {
    console.log('data received: ' + data);
    // Parsing
    Tempcontroller.parse_data(data);
  });
});

// Every 3 seconds ping one of the arduinos
setInterval(function(){
  // send command and receive data from arduinos
    sp.write(pings[ping_index]);
    if(++ping_index > 3) {
      ping_index = 0;
    }
}, 3000);

// Every 2 seconds, and run the print_data
setInterval(function(){
    Tempcontroller.calc_avg();
}, 2000);
// ---- END XBee communication ----- //

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
