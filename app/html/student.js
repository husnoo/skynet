(function() {


    function query_emotions(data) {
	var subscriptionKey = "943a3da539b94315bc353c67557b4b3a";
	var uriBase = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect";
	var params = {
            "returnFaceId": "false",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "emotion",
	};
	var the_url = uriBase + "?" + $.param(params);
	$.ajax({
            url: the_url,
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
            type: "POST",
	    data: data,
	    processData: false
        }).done(function(data) {
	    var face = data[0];
	    var emotion = {}
	    if (face != undefined) {
		emotion = face['faceAttributes']['emotion'];
		emotion["face"] = 1
	    } else {
		emotion = {'face': 0}
	    } 
	    console.log(JSON.stringify(emotion));
	    $.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: '/send_emotions',
		dataType : 'json',
		data : JSON.stringify(emotion)
	    });

	
        }).fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            console.log(errorString);
        });
    }
    
    var width = 120;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
    var streaming = false;    
    var video = null;
    var canvas = null;
    //var timeout;

    function takepicture() {
	var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        if (width && height) {
	    canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
	    var strURI = canvas.toDataURL('image/png');
	    var b64Data = strURI.split(',');
            var byteCharacters = atob(unescape(b64Data[1]));
            var byteNumbers = Array.prototype.map.call(byteCharacters,
						       charCodeFromCharacter);
            var uint8Data = new Uint8Array(byteNumbers);
	    function charCodeFromCharacter(c) {
		return c.charCodeAt(0);
	    }
            //clearTimeout(timeout);
	    //timeout = setTimeout(function() {
	    query_emotions(uint8Data);
	    //}, 5000);
	} else {
	    
        }
    }
    
    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function(stream) {
	    console.log(stream);
            video.srcObject = stream;
            video.play();
        }).catch(function(err) {
            console.log("An error occured! " + err);
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

	function timer() {
	    takepicture();
	    window.setTimeout(timer, 1000);
	};
	window.setTimeout(timer, 100);
    }
    
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
	startup();
    } else {
	document.addEventListener('DOMContentLoaded', startup);
    }
})();
    
    
