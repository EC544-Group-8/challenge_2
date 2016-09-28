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
		for(i=0; i <100; i++){
			var xVal = 2*i*i + 2*i + 4;
			var yVal =	4*i - 3;
			historical_data.push({
				x:  xVal,
				y: 	yVal
			});
			
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
			}]
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

		var time = 0;
		var temp = 100;	
		var updateInterval = 1000;
		var dataLength = 500; // number of dataPoints visible at any point

		var updateChart = function (count) {
			
			// =============================================================================
			// Generate Random data for test
			count = count || 1;
			// count is number of times loop runs to generate random dataPoints.
			
			for (var j = 0; j < count; j++) {	
				temp = temp +  Math.round(5 + Math.random() *(-5-5));
				realtime_data.push({
					x: time,
					y: temp
				});
				time++;
			};
			// =============================================================================

			// =============================================================================
			// Add temperature Data
			// xVal = <INSERT TIME DATA>; // time of measurement	
			// yVal = <INSERT TEMP DATA>; // temp measured

			// realtime_data.push({
				// x: xVal,
				// y: yVal
			// });
			// =============================================================================


			// =============================================================================
			// Scroll Chart if (realtime_data.length > dataLength)
			{
				realtime_data.shift();
			}
			// =============================================================================
			
			// =============================================================================
			// Update Chart
			chart.render();
			// history_chart.render();
			// =============================================================================

		};

		// This function needs to update the current temp variable every interval
		var updateCurrentTemp = function() {
			// Go to the route on the server that is designed to return the most recent average
			$.get('/get_current_avg_temp', function(data) {
				// Update the HTML element that displays this data, and change its value
				$('#average').html(data + "&deg;C");
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
		setInterval(function(){updateChart();}, updateInterval);
		setInterval(function(){updateCurrentTemp();}, updateInterval);
	};

});