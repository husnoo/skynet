function main() {
  runGraph();
  runBackend();
}

main();

var dataObjects = {userid1:"2", userid2:"-2", userid3:"0"};
var dataArray = Object.values(dataObjects);

createRandomData();

var randomDataArray = null;
var numOfClients = null;

function createRandomData() {
	randomDataArray = [];
	numOfClients = Math.floor((Math.random() * 7) + 3);

	console.log("Num of clients: " + numOfClients);

	for (var i = 0; i < numOfClients; i++) {
		randomDataArray[i] = Math.floor((Math.random() * 5) + 2);
		// randomDataArray.push(Math.floor((Math.random() * 5) + 2));
		console.log("Data for pos " + i + ": " + randomDataArray[i]);
	}
}

function runGraph() {

	var dataArray = [0, 15, -15, -25, -10, -25];
	var ctx = document.getElementById("graph").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: ["00:05", "00:04", "00:03", "00:02", "00:01", "Now"],
	        datasets: [{
	            label: 'Total Engagement Levels',
	            data: dataArray,
	            backgroundColor: [
	                'rgba(75, 192, 192, 0.2)',
	            ],
	            borderColor: [
	                'rgba(75, 192, 192, 1)',
	            ],
	            borderWidth: 3
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});
	dataArray[5] = 0;
	dataArray[0] = 25;
  
  console.log("I WORK");
  
  var context2D = document.getElementById("graph").getContext('2d');
  
  var graph = new Chart(context2D, {
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 3
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  });
}

function runBackend() {
    
    function fetch() {
	var request = new XMLHttpRequest();
	request.open('GET', '/teacher-emotions', true);
	request.onload = function() {
	    if (request.status >= 200 && request.status < 400) {
		var data = JSON.parse(request.responseText);
		var str = JSON.stringify(data, null, 2);
		var out = document.getElementById("out");
		out.innerHTML = str;

		var update = document.getElementById("update");
		var timeInMs = Date.now();
		update.innerHTML = timeInMs;
	    } else {
		console.log("error");
	    }
	};
	request.onerror = function() {
	    console.log("error");
	};
	request.send();
    }

    function timer() {
        fetch();
        window.setTimeout(timer, 1000);
    }
    
    function startup() { 
	window.setTimeout(timer, 1000);
    }

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        startup();
    } else {
        document.addEventListener('DOMContentLoaded', startup);
    }

}
