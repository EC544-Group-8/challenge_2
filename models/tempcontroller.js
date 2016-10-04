var Measurement = require('./measurement.js');
var Average = require('./average.js');

var NUM_SENSORS = 4;

// Parse the incoming transmission from a particular node
exports.parse_data = function(dataString) {
  // Format is "2:23.15"
  var arrayOfStrings = dataString.split(':');
  
  // Check to make sure there isn't weird data jamming the buffer
  if(arrayOfStrings.length == 2) {
    var id = arrayOfStrings[0];
    var temp = arrayOfStrings[1];
    
    console.log('parse data id: ' + id + ' ' + temp);
    // Update the measurement object at that ID, as long as the reading is valid (i.e. > -273.15 degrees C)
    if(parseFloat(temp) > -273.15) {
      // Push that temp to the database
      Measurement.create(id, temp, function (err, insert_id) {
        console.log('inserted reading as id ' + insert_id);
      });
    }
  }
};

//var prevTime = 0;
// Calculate the average temperatures from the system
exports.calc_avg = function(){
  var total = 0;
  var divisor = 0;
  //var currentTime = new Date();

  // Get the most the most recent reading from the last 10 minutes from each of the sensors
  Measurement.getAllMostRecentFromLastTenMinutes(function (err, measurements) {
    // Sum all the readings (1 per node)
    if(measurements){
      for(i = 0; i < NUM_SENSORS; i++){
        if(measurements[i]) {
          console.log('looping ' + measurements[i].reading);
          
          //  Check that reading is valid (not the default reset of -500 degrees C)
          if(parseFloat(measurements[i].reading) > -500.00) {
            total += parseFloat(measurements[i].reading);
            divisor++;
          }
        }
      }

      // Check to make sure at least 1 valid reading
      if(divisor > 0){
        avg = total/divisor;
      
      } else {
        avg = -500.00;
      }

      // FOR TESTING ONLY - COMMENT OUT IF WE HAVE THE SENSORS AVAILABLE!!!
      // avg = Math.floor(Math.random() * 90 + 10);
      // FOR TESTING ONLY - COMMENT OUT IF WE HAVE THE SENSORS AVAILABLE!!!
      
      // Print the instantaneous average
      console.log('The Average is:   ' + avg.toFixed(2) + ' degrees Celsius');
      // Only store the average if it's legitimate
      if(avg > -500.00) {
        Average.create(avg.toFixed(2), function (err, insert_id) {
          console.log(err);
          console.log('inserted average as id ' + insert_id);
          //prevTime = currentTime;
        });
      }
    }
  });
};


// Function to calc the average based on an interpolation of temp over time
exports.calc_avg_interpolant = function() {

  for(i = 1; i < 5; i++) {
    Measurement.getAllBySensor(function (i,err, measurements) {
      // linear interpolate to find most recent temp value for each node
  
  });

  } // end for loop
};


