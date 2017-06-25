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
        }).done(function(data) {
            console.log(JSON.stringify(data, null, 2));
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
    



    
    function takepicture() {
	var canvas = document.getElementById('canvas');

        var context = canvas.getContext('2d');
        if (width && height) {
	    canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

	    //var strURI = canvas.toDataURL('image/png');
	    //var byteString = atob(decodeURIComponent(strURI.substring(strURI.indexOf(',')+1)));

	    
	    //var byteArray = new Uint8Array(tar.length);
	    //for (var b = 0; b < tar.length; b++) {
	    //byteArray[b] = tar.charCodeAt(b);
	    //}
	    //var b = new Blob([byteArray.buffer], {'type': 'application/tar'});
	    //window.location.href =  window.URL.createObjectURL(b);

	    var img1 = context.getImageData(0, 0, width, height);
	    var binary = new Uint8Array(img1.data.length);
	    for (var i = 0; i < img1.data.length; i++) {
		binary[i] = img1.data[i];
	    }
	    query_emotions(binary);





	    



	    
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
	    //window.setTimeout(timer, 4000);
	};
	window.setTimeout(timer, 4000);
    }








    
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
	startup();
    } else {
	document.addEventListener('DOMContentLoaded', startup);
    }
})();
    
    
