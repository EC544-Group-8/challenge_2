var db = require('../db.js');

// ISSUES - the date added is manually set up to prepend the "month" with a zero... works until october ('10' instead of '9')

exports.create = function(sensor_id, reading, done) {
  var d = new Date();
  date_received = [d.getFullYear(),
                '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

  // Check the reading value because console.log showed diff values than those stored
  var values = [sensor_id, parseFloat(reading).toFixed(2), date_received];

  db.get().query('INSERT INTO measurements (sensor_id, reading, date_received) VALUES(?, ?, ?)', values, function(err, result) {
    if (err) return done(err);
    done(null, result.insertId);
  });
};

// Query to insert the calculated averages into the averages data table
exports.saveAvg = function(reading, done) {
  var d = new Date();
  date_received = [d.getFullYear(),
                '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

  var values = [reading, date_received];
  db.get().query('INSERT INTO averages (reading, date_received) VALUES(?,?)', values, function(err, result) {
    if(err) return done(err);
    done(null,result.insertId);
  });
};


exports.getAll = function(done) {
  db.get().query('SELECT * FROM measurements', function (err, rows) {
    if (err) return done(err);
    done(null, rows);
  });
};


// Might be better off to use for the interpolation 
exports.getAllBySensor = function(sensor_id, done) {
  db.get().query('SELECT * FROM measurements WHERE sensor_id = ?', sensor_id, function (err, rows) {
    if (err) return done(err);
    done(null, rows);
  });
};

// Query to obtain readings from each Node in the last 10 minutes
exports.getAllMostRecent = function(done) {
  var d = new Date();
  now = [d.getFullYear(),
           '0'+(d.getMonth()+1),
            d.getDate(),
            ].join('-')+' '+
           [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
  
  db.get().query('SELECT * FROM measurements WHERE date_received < ? + INTERVAL 10 MINUTE group by sensor_id', now, function(err,rows) {
    if(err) return done(err);
    done(null, rows);
  });
};


// Query to get data for linear interpolation 
// Then we will need to build 2D vectors of temp and time 
// for each node and then pass this data to the interpolation 
exports.getAllForInterpolant = function(done) {
  var d = new Date();
  now = [d.getFullYear(),
               '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');
  
  db.get().query('SELECT * FROM measurements WHERE date_received < ?', now, function(err,rows) {
    if(err) return done(err);
    done(null, rows);
  });
};



// Query to get Historical data for each Node based on a slider? or radio button on Front End
exports.getHistoricNode = function(sensor_id, range, done) {
  var d = new Date();
  var now = [d.getFullYear(),
               '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

  db.get().query('SELECT * FROM measurements WHERE (date_received < (now + INTERVAL ?)) and sensor_id = ?',
      range, sensor_id, function(err,rows) {
      if(err) return done(err);
      done(null, rows);
     });
};


exports.getAllHistorical = function(range, done) {
  var d = new Date();
  var now = [d.getFullYear(),
               '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

  db.get().query('SELECT * FROM averages WHERE date_received < now + INTERVAL ?',range, function(err,rows) {
    if(err) return done(err);
    done(null, rows);
  });
};


// Query to get data necessary for Total Historical Average
// Maybe we want to store each calulated Total average into another table








