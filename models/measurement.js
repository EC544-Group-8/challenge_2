var db = require('../db.js');

exports.create = function(measurement_id, sensor_id, reading, date, done) {
  var values = [measurement_id, sensor_id, reading, date, new Date().toISOString()];
  
  db.get().query('INSERT INTO measurements (id, sensor_id, reading, date_received, date_added) VALUES(?, ?, ?, ?, ?)', values, function(err, result) {
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