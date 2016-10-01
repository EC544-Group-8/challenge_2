

/*var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "overwrite", filename : "simple-node-example"};

plotly.plot(data, layout, function (err, msg) {
	if (err) return console.log(err);
	console.log(msg);
});*/



// T00=22;//bottom left
// T01=25;//bottom right
// T11=20;//top right
// T10=22; //top left



var updateHeatMap = function() {
  var plotly = require('plotly')("delollis", "cj716hsz4v");
  var Nrows=10;
  var Ncols=10;
  var T = [];
  for(var i = 0; i < 4; i++) {
    $.get('/get_heat_map/1', function (data) {
        var xtemp = parseFloat(data.reading);
        // Push it to the array for storage
        tempVec.push(xtemp);
      });
  }


  function Create2DArray(rows) {
    var arr = [];

    for (var i=0;i<rows;i++) {
       arr[i] = [];
    }

    return arr;
  }

  var myarr=Create2DArray(Ncols);

  for (i = 0; i < (Ncols); ++i) {
      myarr[i] = Create2DArray(Nrows);
      for (j = 0; j < (Nrows); ++j) {
      	x=(1/(Ncols-1))*i;
      	y=(1/(Nrows-1))*j;
      	myarr[i][j]=T[0]*(1-x)*(1-y)+T[3]*(x)*(1-y)+T[1]*(1-x)*(y)+T[2]*(x)*(y);
      }
  }
  console.log(myarr);


  var data = [
    {
      z: myarr,
      type: 'heatmap',
  	zsmooth: 'best'
    }
  ];
  var layout = {fileopt : "overwrite", 
  	filename : "heatmap-node"

  };

  plotly.plot(data, layout, function (err, msg) {
  	if (err) return console.log(err);
  	console.log(msg);
  });
};






