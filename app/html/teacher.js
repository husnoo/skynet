(function() {
    
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
    };
    
    function startup() { 
	window.setTimeout(timer, 1000);
    };

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        startup();
    } else {
        document.addEventListener('DOMContentLoaded', startup);
    }
})();
