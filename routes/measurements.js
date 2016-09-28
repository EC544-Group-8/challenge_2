var express = require('express');
var router = express.Router();
var Measurement = require('../models/measurement.js');

/* GET measurement listing. */
router.get('/', function(req, res, next) {

	// Get from the DB
	Measurement.getAllMostRecentFromLastTenMinutes(function (err, measurements) {
		res.render('measurements', { title: 'Measurements', measurements: measurements });
	});
});


module.exports = router;
