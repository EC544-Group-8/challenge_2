var plotly = require('plotly')("delollis", "cj716hsz4v");

/*var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "overwrite", filename : "simple-node-example"};

plotly.plot(data, layout, function (err, msg) {
	if (err) return console.log(err);
	console.log(msg);
});*/


var Nrows=10;
var Ncols=10;
T00=20;
T01=20;
T11=25;
T10=25;

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
    	x=(1/Ncols)*i;
    	y=(1/Nrows)*j;
    	myarr[i][j]=T00*(1-x)*(1-y)+T10*(x)*(1-y)+T01*(1-x)*(y)+T11*(x)*(y);
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




