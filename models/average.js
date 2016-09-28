var db = require('../db.js');

// Query to insert the calculated averages into the averages data table
exports.create = function(reading, done) {
  var d = new Date();
  date_received = [d.getFullYear(),
                '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

  // Check the reading value because console.log showed diff values than those stored
  var values = [parseFloat(reading).toFixed(2), date_received];

  db.get().query('INSERT INTO averages (avg_reading, date_received) VALUES(?, ?)', values, function (err, result) {
    if (err) return done(err);
    done(null, result.insertId);
  });
};

// Query to get all the rows from the measurements table
exports.getAll = function(done) {
  db.get().query('SELECT * FROM averages', function (err, rows) {
    if (err) return done(err);
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

  db.get().query('SELECT * FROM averages WHERE date_received > (NOW() - INTERVAL ?)', range, function (err, rows) {
    if(err) return done(err);
    done(null, rows);
  });
};

// Query to obtain the most recent average reading
exports.getMostRecent = function(done) {
  var d = new Date();
  now = [d.getFullYear(),
           '0'+(d.getMonth()+1),
            d.getDate(),
            ].join('-')+' '+
           [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
  
  db.get().query('SELECT * FROM averages ORDER BY date_received DESC LIMIT 1', function (err, rows) {
    if(err) return done(err);
    done(null, rows);
  });
};
