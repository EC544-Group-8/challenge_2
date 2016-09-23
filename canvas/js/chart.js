// Connect to Database


// Receive Individual Data (already built)


// Load last 20 readings at start if they exist


window.onload = function () {

	var dps = []; // dataPoints

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
			dataPoints: dps 
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
			dataPoints: dps 
		}]
	});

	var time = 0;
	var temp = 100;	
	var updateInterval = 100;
	var dataLength = 500; // number of dataPoints visible at any point

	var updateChart = function (count) {
		
		// =============================================================================
		// Generate Random data for test
		count = count || 1;
		// count is number of times loop runs to generate random dataPoints.
		
		for (var j = 0; j < count; j++) {	
			temp = temp +  Math.round(5 + Math.random() *(-5-5));
			dps.push({
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

		// dps.push({
			// x: xVal,
			// y: yVal
		// });
		// =============================================================================


		// =============================================================================
		// Scroll Chart if (dps.length > dataLength)
		{
			dps.shift();				
		}
		// =============================================================================
		
		// =============================================================================
		// Update Chart
		chart.render();		
		history_chart.render();
		// =============================================================================

	};

	// generates first set of dataPoints
	updateChart(dataLength); 

	// update chart after specified time. 
	setInterval(function(){updateChart()}, updateInterval); 
}
