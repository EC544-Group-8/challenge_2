var express = require('express');
var router = express.Router();
var Measurement = require('../models/measurement.js');

/* GET measurement listing. */
router.get('/', function(req, res, next) {

	// Get all the measurements from last 10 minutes for temporary table in header
	Measurement.getAllMostRecentFromLastTenMinutes(function (err, measurements) {
		// Render the measurements.ejs view
		res.render('measurements', { title: 'Measurements', measurements: measurements});
	});
});


module.exports = router;
