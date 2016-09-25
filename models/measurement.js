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
