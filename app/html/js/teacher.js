(function() {

    var dataObjects = {userid1:"2", userid2:"-2", userid3:"0"};
    var dataArray = Object.values(dataObjects);
    var randomDataArray = null;
    var numOfClients = null;
    var dataSumHistory = [0,0,0,0,0,0];


    var width = 200;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
    var streaming = false;
    
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    
    function main() {
	dataTimer();
	runGraph();
	createColourCells();
	runBackend();
	start_webcam();
    }

    function updateDataSumHistory() {
	var sumOfData = 0;
	
	for (var i = 0; i < 6; i++) {
            sumOfData += dataArray[i];
	}

	dataSumHistory.shift();
	dataSumHistory[5] = sumOfData;

	for (var i = 0; i < dataSumHistory.length; i++) {
            //console.log("Item " + i + ": " + dataSumHistory[i]);
            // randomDataArray.push(Math.floor((Math.random() * 5) + 2));
	}
    }

    function createRandomData() {
	randomDataArray = [];
	numOfClients = Math.floor((Math.random() * 7) + 3);
	
	for (var i = 0; i < numOfClients; i++) {
            randomDataArray[i] = Math.floor((Math.random() * 5) + 2);
            // randomDataArray.push(Math.floor((Math.random() * 5) + 2));
	}
    }

    function dataTimer() {
	createRandomData();
	dataArray = randomDataArray;
	updateDataSumHistory();
	window.setTimeout(dataTimer, 1000);
    }
    
    function runGraph() {
	console.log(document.getElementById("graph"))
	var ctx = document.getElementById("graph").getContext('2d');
	var myChart = new Chart(ctx, {
            type: 'line',
            data: {
		labels: ["00:05", "00:04", "00:03", "00:02", "00:01", "Now"],
		datasets: [{
                    label: 'Total Engagement Levels',
                    data: dataSumHistory,
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

    var cells = [];

    function createColourCells() {
	var letters = "ABCDEFGH";
	for(var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
		cells.push("" + letters.charAt(x) + y);	
            }
	}
    }

    function switchColour (score, cell){
	currentCell = cell; // set current cell
	switch (score) { // Add case for engagement = -3 (no face)
        case -2:
            //console.log("score is -2 so colour is red");
            currentCell.style.backgroundColor = "#dd2c00";// red set selected cell's colour
            break;
        case -1:
            //console.log("score is -1 so colour is orange");
            currentCell.style.backgroundColor = "#ffa726";// set orange selected cell's colour (orange)
            break;        
        case 0:
            currentCell.style.backgroundColor = "#ffeb3b";// yellow set selected cell's colour
            break;
        case 1:
            currentCell.style.backgroundColor = "#b2ff59";// yellow-green set selected cell's colour (yellowish-green)
            break;
        case 2:
            currentCell.style.backgroundColor = "#64dd17";// green set selected cell's colour
            break;
        default:
            currentCell.style.backgroundColor = "grey";
            break;
	};
    }

    var control = {
        // Init // make it go!
        // Set all grid cells as unassigned (initially)
        // Get current data snapshot from incoming data stream
        getCurrentData: function(){
            return model; // getting static snapshot of the data is important 
            //because order of users may change
            // in direct data feed from the server
        },
        // Creating userID:cell 
        // extract array of user IDs from data object snapshot
        extractUserIDs: function() {
            var currentData = this.getCurrentData(); // snapshot from data stream
            var UserIDs = Object.keys(currentData); 
            return UserIDs; // outputs array [0:userID1; 1:userID2 ...]
        }, 
        // extract array of engagements from data object snapshot
        createEngagements: function(){
	    console.log(userCells)
            for (var myKey in model) {
                if (model.hasOwnProperty(myKey)) {
                    if(myKey in userCells) {
                        switchColour(model[myKey], document.getElementById(userCells[myKey]));
                    } else {
			userCells[myKey] = cells[userCounter];
                        userCounter++;
                        switchColour(model[myKey], document.getElementById(userCells[myKey]));
                    }
                }
            }
            var currentData = this.getCurrentData();
            //console.log("current data is: " + currentData);
            var currentUserIDs = this.extractUserIDs();
            //console.log("currentUserIDs are: "+ currentUserIDs);
            for (i=0; i<currentUserIDs.length; i++){
                //console.log("i is : " + i);
                var currentUser = currentUserIDs[i]; 
                //console.log("current user is: " + currentUser);
                //var currentEngagement = currentData.userID1.engagement;
                var currentEngagement = currentData[currentUser].engagement;
                console.log("current engagement value: ");
            }
        }
        // Assign each NEW user a fixed cell 
        // Compare previous data object to current one to keep 
        // Convert engagement values into integers between -2 an +2
    };

    var userCells = {};
    var model = {};
    var userCounter = 0;

    function runBackend() {
	
	
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
		
    }

    function fetch() {
	var request = new XMLHttpRequest();
	request.open('GET', '/teacher-emotions', true);
	request.onload = function() {
	    if (request.status >= 200 && request.status < 400) {
		model = JSON.parse(request.responseText);
		control.createEngagements();
		var str = JSON.stringify(model, null, 2);
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
	main();
    }
    
    function start_webcam() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function(stream) {
	    //console.log(stream);
            video.srcObject = stream;
            video.play();
        }).catch(function(err) {
            //console.log("An error occured! " + err);
        });
        video.addEventListener('canplay', function(ev){
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth/width);
                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);
    }

    
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        startup();
    } else {
        document.addEventListener('DOMContentLoaded', startup);
    }
})();
