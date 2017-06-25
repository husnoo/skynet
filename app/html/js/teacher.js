(function() {
    
    var background_color = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];
    var borderColor = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];
    
    function fetch() {
	var request = new XMLHttpRequest();
	request.open('GET', '/teacher-emotions', true);
	request.onload = function() {
	    if (request.status >= 200 && request.status < 400) {
		var data = JSON.parse(request.responseText);
		var str = JSON.stringify(data, null, 2);
		var out = document.getElementById("out");
		out.innerHTML = str;
		console.log(out, str, data);
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
    
    var dataObjects = {userid1:"2", userid2:"-2"};
    
    var context2D = document.getElementById("graph").getContext('2d');
    
    var dataArray = [15, 0, 3];
    
    var graph = new Chart(context2D, {
	data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
		label: '# of Votes',
		data: [12, 19, 3, 5, 2, 3],
		backgroundColor: background_color,
		borderColor: borderColor,
		borderWidth: 1
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
})();
