// What type of function declarations are these?
var parse_time = function(time, done) {
	// YYYY-MM-DDTHH:MM:SS.0007  to seconds
	// console.log("full time is " + time);
	var year = parseInt(time.substr(0,4),10);
	var month = parseInt(time.substr(5,2),10);
	var day = parseInt(time.substr(8,2),10);
	var hour = parseInt(time.substr(11,2),10); // TODO! get this in current timezone
	var minute = parseInt(time.substr(14,2),10);
	var second = parseInt(time.substr(17,2),10);
	// console.log("time is: " + time_str);

	var time_date = new Date(year,month,day,hour,minute,second);
	// console.log("seconds is: " + seconds);
	done(time_date);
};

$(document).ready(function () {
	// Connect to Database
	// Receive Individual Data (already built)
	// Load last 20 readings at start if they exist


	window.onload = function () {

		var realtime_data = []; 
		var historical_data = [];
		var sensor1_data = [];
		var sensor2_data = [];
		var sensor3_data = [];
		var sensor4_data = [];
		

		//=====================================================
		// Test data
		/*
		for(i=0; i <100; i++){
			var xVal = 2*i*i + 2*i + 4;
			var yVal =	4*i - 3;
			// historical_data.push({
			// 	x:  xVal,
			// 	y: 	yVal
			// });
			
			sensor1_data.push({
				x:  xVal,
				y: 	yVal
			});
			sensor2_data.push({
				x:  xVal,
				y: 	yVal
			});
			sensor3_data.push({
				x:  xVal,
				y: 	yVal
			});
			sensor4_data.push({
				x:  xVal,
				y: 	yVal
			});
		}
		*/
		//=====================================================

		var chart = new CanvasJS.Chart("scroller",{
			title :{
				text: "Real Time Average Temperature"
			},			
			axisX:{
				title:"Time (s)"
			},
			axisY:{
				title:"Temperature (°C)"
			},
			data: [{
				type: "line",
				dataPoints: realtime_data
			}]
		});


		// Get current historical temp and time data
		$.get('/get_hist_avg_temp', function(hist_data) {
			// Loop through all historic data
			for (var i = 0; i < hist_data.length; i++) {
				// Get the temp and the time
				var xtime;
				var xtemp = parseFloat(hist_data[i].avg_reading);
				// Convert the time to the proper format			
				parse_time(hist_data[i].date_received, function(new_time) {
					xtime = new_time;
				});

				// Push it into the historic_data array for the chart
				historical_data.push({
					x:  xtime,
					y:  xtemp
				});
			};
		});
		// Prepare the historical chart
		var history_chart = new CanvasJS.Chart("history",{
			title :{
				text: "Historical Average Temperature"
			},			
			axisX:{
				title:"Time (s)"
			},
			axisY:{
				title:"Temperature (°C)"
			},
			data: [{
				type: "line",
				dataPoints: historical_data
				console.log('We are r/x historical data...' + historical_data[10]);
			}]
		});




		$.get('/get_hist_sensor/1', function (s1_hist_data) {
			for (var i = 0; i < s1_hist_data.length; i++) {
				var xtemp = parseFloat(s1_hist_data[i].avg_reading);
				parse_time(s1_hist_data[i].date_received, function(new_time) {
					var xtime = new_time;
				});

				// Push it to the array for storage
				sensor1_data.push({
					x: xtemp,
					y: xtime
				});
			};
		});


		$.get('/get_hist_sensor/2', function (s2_hist_data) {
			for (var i = 0; i < s2_hist_data.length; i++) {
				var xtemp = parseFloat(s2_hist_data[i].avg_reading);
				parse_time(s2_hist_data[i].date_received, function(new_time) {
					var xtime = new_time;
				});

				// Push it to the array for storage
				sensor2_data.push({
					x: xtemp,
					y: xtime
				});
			};
		});


		$.get('/get_hist_sensor/3', function (s3_hist_data) {
			for (var i = 0; i < s3_hist_data.length; i++) {
				var xtemp = parseFloat(s3_hist_data[i].avg_reading);
				parse_time(s1_hist_data[i].date_received, function(new_time) {
					var xtime = new_time;
				});

				// Push it to the array for storage
				sensor3_data.push({
					x: xtemp,
					y: xtime
				});
			};
		});



		$.get('/get_hist_sensor/4', function (s4_hist_data) {
			for (var i = 0; i < s4_hist_data.length; i++) {
				var xtemp = parseFloat(s4_hist_data[i].avg_reading);
				parse_time(s4_hist_data[i].date_received, function(new_time) {
					var xtime = new_time;
				});

				// Push it to the array for storage
				sensor4_data.push({
					x: xtemp,
					y: xtime
				});
			};
		});



		var sensor1_chart = new CanvasJS.Chart("sensor1",{
			title :{
				text: "Kitchen Temperature"
			},			
			axisX:{
				title:"Time (s)"
			},
			axisY:{
				title:"Temperature (°C)"
			},
			data: [{
				type: "line",
				dataPoints: sensor1_data 
			}]
		});

		var sensor2_chart = new CanvasJS.Chart("sensor2",{
			title :{
				text: "Living Room Temperature"
			},			
			axisX:{
				title:"Time (s)"
			},
			axisY:{
				title:"Temperature (°C)"
			},
			data: [{
				type: "line",
				dataPoints: sensor2_data 
			}]
		});
		
		var sensor3_chart = new CanvasJS.Chart("sensor3",{
			title :{
				text: "Bedroom Temperature"
			},			
			axisX:{
				title:"Time (s)"
			},
			axisY:{
				title:"Temperature (°C)"
			},
			data: [{
				type: "line",
				dataPoints: sensor3_data 
			}]
		});

		var sensor4_chart = new CanvasJS.Chart("sensor4",{
			title :{
				text: "Office Temperature"
			},			
			axisX:{
				title:"Time (s)"
			},
			axisY:{
				title:"Temperature (°C)"
			},
			data: [{
				type: "line",
				dataPoints: sensor4_data 
			}]
		});

		var time = new Date(2012,01,1);
		var temp = -500;	
		var updateInterval = 1000;
		var dataLength = 50; // number of dataPoints visible at any point

		var updateChart = function () {
			
			// Get current avg temp and time
			$.get('/get_current_avg_temp', function(data) {
				temp = parseFloat(data.avg_reading);
				console.log('DATA: '+data.date_received);
				parse_time(data.date_received, function(new_time) {
					time = new_time;
				});
			});
			// Get current time
			// TODO
			// console.log(time);
			// console.log(temp);

			if (temp > -500){
				console.log("got here with t=" + time);
				// Add the new reading to the realtime chart
				realtime_data.push({
					x: time,
					y: temp
				});
				// Add the new reading to the historical chart
				historical_data.push({
					x: time,
					y: temp
				});
			}

			// Scroll Realtime Chart if necessary
			if (realtime_data.length > dataLength)
			{
				// pop the oldest reading
				realtime_data.shift();
			}
			
			// Update Chart
			chart.render();
			history_chart.render();

		};

		// This function needs to update the current temp variable every interval
		var updateCurrentTemp = function() {
			// Go to the route on the server that is designed to return the most recent average
			$.get('/get_current_avg_temp', function(data) {
				// Update the HTML element that displays this data, and change its value
				$('#average').html(data.avg_reading.toFixed(2) + "&deg;C");
			});
		};
		// generates first set of dataPoints
		updateChart(dataLength);

		// Load Historical Data based on user choice (or default)
		history_chart.render();
		sensor1_chart.render();
		sensor2_chart.render();
		sensor3_chart.render();
		sensor4_chart.render();

		// update displays after specified time. 
		setInterval(function(){updateChart(1);}, updateInterval);
		setInterval(function(){updateCurrentTemp();}, updateInterval);

	};
});
