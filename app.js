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
  baudRate: 9600,
  parser: SerialPort.parsers.readline("\n")
};
var sp;
sp = new SerialPort.SerialPort(portName, portConfig);

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

// When the controller xBee's serialport is filled, parse the data
sp.on("open", function () {
  console.log('open');
  sp.on('data', function(data) {
    //console.log('data received: ' + data);
    // Parsing
    parse_data(data);
  });
});

var ping_index = 0;
var avg = -500.00;

var NUM_SENSORS = 4;
var pings = ['a', 'b', 'c', 'd'];
var measurement = {
  '1': '-500.00',
  '2': '-500.00',
  '3': '-500.00',
  '4': '-500.00'
};
var time_out_countdown = {
  '1': 10,
  '2': 10,
  '3': 10,
  '4': 10,
};

// Parse the incoming transmission from a particular node
function parse_data(dataString) {
  // Format is "2:23.15"
  var arrayOfStrings = dataString.split(':');
  
  // Check to make sure there isn't weird data jamming the buffer
  if(arrayOfStrings.length == 2) {
    var id = arrayOfStrings[0];
    var temp = arrayOfStrings[1];
    
    // console.log('parse data id: ' + id + ' ' + temp);
    // Update the measurement object at that ID, as long as the reading is valid (i.e. > -273.15 degrees C)
    if(parseFloat(temp) > -273.15) {
      measurement[id] = temp;
      time_out_countdown[id] = 10;
    }
  }
}

// Calculate the average temperatures from the system
function calc_avg(allData){
  var total = 0;
  var divisor = 0;

  // Sum all the readings (1 per node)
  for(i = 1; i < NUM_SENSORS+1; i++){
    //  Check that reading is valid (not the default reset of -500 degrees C)
    if(parseFloat(allData[i]) > -500.00) {
      total += parseFloat(allData[i]);
      divisor++;
    }
    // Reduce the countdown to timeout for each of the sensors 
    if(--time_out_countdown[i] <= 0 && allData[i] != -500.00){
      // reset the reading to the default, so that its not used in the average anymore
      allData[i] = -500.00;
    }
  }

  // Check to make sure at least 1 valid reading
  if(divisor > 0){
    avg = total/divisor;
  
  } else {
    avg = -500.00;
  }
}

// send command and receive data from arduinos
function get_data(index){
  // Send the command to an arduino
  sp.write(pings[index]);
}

// Print the instantaneous average
function print_data(avgTemp){
    console.log('The Average is:   ' + avgTemp.toFixed(2) + ' degrees Celsius');
}

// Every .3 seconds, and ping one of the arduinos
setInterval(function(){
    get_data(ping_index);
    if(++ping_index > 3) {
      ping_index = 0;
    }
}, 300);

// Every 2 seconds, and run the print_data
setInterval(function(){
    calc_avg(measurement);
    print_data(avg);
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
