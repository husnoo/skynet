(function() {
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
    
    var streaming = false;
    
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;
    
    
    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');
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
	    window.setTimeout(timer, 3000);
	};
	window.setTimeout(timer, 3000);
    }

    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
	    canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            var data = canvas.toDataURL('image/png');
	    
	    var request = new XMLHttpRequest();
	    request.open('POST', '/student_images', true);
	    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	    request.send(data);
        } else {
	    
        }
    }
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
	startup();
    } else {
	document.addEventListener('DOMContentLoaded', startup);
    }
})();
    
    
