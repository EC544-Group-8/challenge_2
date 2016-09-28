var express = require('express');
var router = express.Router();
var Measurement = require('../models/measurement.js');

/* GET users listing. */
router.get('/', function(req, res, next) {

	// Get from the DB
	Measurement.getAllMostRecent(function (err, measurements) {
		res.render('measurements', { title: 'Measurements', measurements: measurements });
	});
});


module.exports = router;
