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
// Create variables for the file location of any routes (connected to views)
var routes = require('./routes/index');
var measurements = require('./routes/measurements');

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

// --------- DEFINE AJAX POST REQUESTS HERE --------- //
var Average = require('./models/average.js');
var Measurement = require('./models/measurement.js');

// For retreiving the current average temp
app.get('/get_current_avg_temp', function(req, res){
  Average.getMostRecent(function(err, avg_temps){
    if(avg_temps && avg_temps[0]){
      res.send(avg_temps[0]);
    }
  });
});

// For retreiving the historic average temp
app.get('/get_hist_avg_temp', function(req, res){
  Average.getAll(function (err, hist_temps){
    if(hist_temps){
      res.send(hist_temps);
    }
  });
});


// For retreiving the historic average data for each sensor 
app.get('/get_hist_sensor/1', function(req,res) {
  Measurement.getAllBySensor(1, function (err, hist_data) {
    if(hist_data) {
      res.send(hist_data);
    }
  });
});
app.get('/get_hist_sensor/2', function(req,res) {
  Measurement.getAllBySensor(2, function (err, hist_data) {
    if(hist_data) {
      res.send(hist_data);
    }
  });
});
app.get('/get_hist_sensor/3', function(req,res) {
  Measurement.getAllBySensor(3, function (err, hist_data) {
    if(hist_data) {
      res.send(hist_data);
    }
  });
});

app.get('/get_hist_sensor/4', function(req,res) {
  Measurement.getAllBySensor(4, function (err, hist_data) {
    if(hist_data) {
      res.send(hist_data);
    }
  });
});

app.get('/get_most_recent_measurement', function(req,res) {
  Measurement.getMostRecent(function (err, last_reading) {
    if(last_reading && last_reading[0]){
      res.send(last_reading[0]);
    }
  });
});

// Keeps the heat map up to date with new data from each sensor
// Most likely can be deleted
app.get('/get_heat_map/1', function(req,res) {
  console.log('Grabbing the heat map data');
  Measurement.getMostRecentBySensor(1, function (err, last_reading) {
    if(last_reading && last_reading[0]){
      res.send(last_reading[0]);
      
    }
  });
});

// --------- END AJAX POST REQUESTS --------- //



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

// building the heat map 
var plotly = require('plotly')("delollis", "cj716hsz4v");
var heatMapController = require('./models/heatmap.js');
setInterval(function(){
  heatMapController.updateHeatMap();
},120000);
//=======================================================================

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
