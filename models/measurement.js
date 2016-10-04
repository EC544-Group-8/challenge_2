var db = require('../db.js');

// ISSUES - the date_received is manually set up to prepend the "month" with a zero... works until october ('10' instead of '9')

// Query to insert the measurement from a sensor into the measurements data table
exports.create = function(sensor_id, reading, done) {
  var d = new Date();
  date_received = [d.getFullYear(),
                '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');
  // console.log("the date_received from measSQL:");
  // console.log(date_received);

  // Check the reading value because console.log showed diff values than those stored
  var values = [sensor_id, parseFloat(reading).toFixed(2), date_received];

  db.get().query('INSERT INTO measurements (sensor_id, reading, date_received) VALUES(?, ?, ?)', values, function(err, result) {
    if (err) return done(err);
    done(null, result.insertId);
  });
};

// Query to get all the rows from the measurements table
exports.getAll = function(done) {
  db.get().query('SELECT * FROM measurements', function (err, rows) {
    if (err) return done(err);
    done(null, rows);
  });
};


// Query to get all the rows for a particular sensor - Might be better off to use for the interpolation 
exports.getAllBySensor = function(sensor_id, done) {
  console.log("IN model");
  db.get().query('SELECT * FROM measurements WHERE sensor_id = ?', sensor_id, function (err, rows) {
    if (err) return done(err);
    done(null, rows);
  });
};

// Query to obtain the most recent reading from each sensor from the last 10 minutes (if one exists for each sensor)
exports.getAllMostRecentFromLastTenMinutes = function(done) {
  var d = new Date();
  now = [d.getFullYear(),
           '0'+(d.getMonth()+1),
            d.getDate(),
            ].join('-')+' '+
           [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
  
  db.get().query('SELECT m1.* FROM measurements m1 WHERE m1.date_received = (SELECT MAX(m2.date_received) FROM measurements m2 WHERE m2.sensor_id = m1.sensor_id AND date_received > DATE_SUB(NOW(), INTERVAL 1 MINUTE ))', function (err,rows) {
    if(err) return done(err);
    done(null, rows);
  });
};

// Query to obtain the most recent reading to the database
exports.getMostRecent = function(done) {
  var d = new Date();
  now = [d.getFullYear(),
           '0'+(d.getMonth()+1),
            d.getDate(),
            ].join('-')+' '+
           [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
  
  db.get().query('SELECT * FROM measurements ORDER BY date_received DESC LIMIT 1', function (err, rows) {
    if(err) return done(err);
    done(null, rows);
  });
};


// Query to obtain the most recent reading for a particular sensor
exports.getMostRecentBySensor = function(sensor_id, done) {
  var d = new Date();
  now = [d.getFullYear(),
           '0'+(d.getMonth()+1),
            d.getDate(),
            ].join('-')+' '+
           [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
  
  db.get().query('SELECT * FROM measurements WHERE sensor_id = ? ORDER BY date_received DESC LIMIT 1', sensor_id, function (err, rows) {
    if(err) return done(err);
    done(null, rows);
  });
};


// Query to get all the calculated averages over the last range of time
exports.getAllByRange = function(range, done) {
  var d = new Date();
  var now = [d.getFullYear(),
               '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

  db.get().query('SELECT * FROM averages WHERE (date_received > (NOW() - INTERVAL ?))', range, function (err,rows) {
    if(err) return done(err);
    done(null, rows);
  });
};


// Query to get all the rows for a particular sensor based on a range (slider? or radio button on Front End)
exports.getBySensorByRange = function(sensor_id, range, done) {
  var d = new Date();
  var now = [d.getFullYear(),
               '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

  db.get().query('SELECT * FROM measurements WHERE (date_received > (NOW() - INTERVAL ?)) and sensor_id = ?',
      range, sensor_id, function (err,rows) {
      if(err) return done(err);
      done(null, rows);
     });
};



// TODO: Update this or delete it, as it duplicates the exports.getAll function as currently written
// Query to get data for linear interpolation 
// Then we will need to build 2D vectors of temp and time 
// for each sensor and then pass this data to the interpolation 
exports.getAllForInterpolant = function(done) {
  var d = new Date();
  now = [d.getFullYear(),
               '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');
  
  db.get().query('SELECT * FROM measurements', function (err,rows) {
    if(err) return done(err);
    done(null, rows);
  });
};

// Query to get data necessary for Total Historical Average
// Maybe we want to store each calulated Total average into another table








