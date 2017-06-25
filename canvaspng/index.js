(function() {

    function dostuff() {
	var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

	console.log(context, canvas)
	//var strURI = canvas.toDataURL('image/png');
	//var byteString = atob(decodeURIComponent(strURI.substring(strURI.indexOf(',')+1)));
	//var byteArray = new Uint8Array(tar.length);
	//for (var b = 0; b < tar.length; b++) {
	//byteArray[b] = tar.charCodeAt(b);
	//}
	//var b = new Blob([byteArray.buffer], {'type': 'application/tar'});
	//window.location.href =  window.URL.createObjectURL(b);
	//var img1 = context.getImageData(0, 0, width, height);
	//var binary = new Uint8Array(img1.data.length);
	//for (var i = 0; i < img1.data.length; i++) {
	//	binary[i] = img1.data[i];
	//}
	    
    }
    
    function startup() {
        canvas = document.getElementById('canvas');
        function timer() {
	    dostuff();
	    //window.setTimeout(timer, 4000);
	};
	window.setTimeout(timer, 10);
    }

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
	startup();
    } else {
	document.addEventListener('DOMContentLoaded', startup);
    }
})();
    
    
