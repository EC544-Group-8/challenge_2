var db = require('../db.js');

exports.create = function(sensor_id, reading, done) {
  var d = new Date();
  date_added = [d.getFullYear(),
                '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');

  // Check the reading value because console.log showed diff values than those stored
  var values = [sensor_id, parseFloat(reading).toFixed(2), date_added, date_added];

  db.get().query('INSERT INTO measurements (sensor_id, reading, date_received, date_added) VALUES(?, ?, ?, ?)', values, function(err, result) {
    if (err) return done(err);
    done(null, result.insertId);
  });
};

exports.getAll = function(done) {
  db.get().query('SELECT * FROM measurements', function (err, rows) {
    if (err) return done(err);
    done(null, rows);
  });
};

exports.getAllBySensor = function(sensor_id, done) {
  db.get().query('SELECT * FROM measurements WHERE sensor_id = ?', sensor_id, function (err, rows) {
    if (err) return done(err);
    done(null, rows);
  });
};

// Query to obtain readings from each Node in the last 10 minutes
// select * from challenge_2 where date_added < (now + interval 10 minute)
// GROUP by sensro_id;
exports.getAllMostRecent = function(sensor_id, done) {
  var d = new Date;
  var now = [d.getFullYear(),
               '0'+(d.getMonth()+1),
                d.getDate(),
                ].join('-')+' '+
               [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');
  db.get().query('SELECT * FROM measurements WHERE (? + INTERVAL 10 MINUTE) group by sensor_id', now, function(err,rows){
    if(err) return done(err);
    done(null, rows);
  });
};








