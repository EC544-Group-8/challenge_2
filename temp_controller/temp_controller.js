// code adopted from https://github.com/EC544-BU/EC544_demos/tree/master/demos/xbeeChat 
// AND https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-communication-with-node-js/

var SerialPort = require("serialport");

var portName = process.argv[2],
portConfig = {
	baudRate: 9600,
	parser: SerialPort.parsers.readline("\n")
};
var sp;
sp = new SerialPort.SerialPort(portName, portConfig);

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

// Parse the incoming transmission from a particular node
function parse_data(dataString) {
  // Format is "2:23.15"
  var arrayOfStrings = dataString.split(':');
  
  // Check to make sure there isn't weird data jamming the buffer
  if(arrayOfStrings.length == 2) {
    var id = arrayOfStrings[0];
    var temp = arrayOfStrings[1];
    
    // console.log('parse data id: ' + id + ' ' + temp);
    // Update the measurement object at that ID
    measurement[id] = temp;
    
  }
}

// Calculate the average temperatures from the system
function calc_avg(allData){
  var total = 0;
  var divisor = 0;

  // Sum all the readings (1 per node)
  for(i = 1; i < NUM_SENSORS+1; i++){
    //  Check that reading is valid (i.e. > -273.15 degrees C)
    if(parseFloat(allData[i]) > -273.15) {
      total += parseFloat(allData[i]);
      divisor++;
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
