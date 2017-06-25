(function() {


/*

network is big endian
x86 is little endian

png magic number is 89 50 4e 47 0d 0a 1a 0a

[nawal@heisenbug:~/data/skynet.js/canvaspng]$ hexdump -C fromhtml.png | head -n 3
00000000  89 50 4e 47 0d 0a 1a 0a  00 00 00 0d 49 48 44 52  |.PNG........IHDR|
00000010  00 00 01 2c 00 00 00 96  08 06 00 00 00 64 5b b5  |...,.........d[.|
00000020  d2 00 00 05 12 49 44 41  54 78 5e ed d4 c1 69 04  |.....IDATx^...i.|


Old convert in JS:
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAFEklEQ…WpDBIgsBYQrPUF7CdAIAsIVqYySIDAWkCw1hewnwCBLPAHkCOgl+0t5PcAAAAASUVORK5CYII=

in python:
>>> data = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAFEklEQ…WpDBIgsBYQrPUF7CdAIAsIVqYySIDAWkCw1hewnwCBLPAHkCOgl+0t5PcAAAAASUVORK5CY"
>>> byte_array = str(data.split(",")[1].decode('base64'))
>>> byte_array
"\x89    P    N     G    \r  \n  \x1a    \n   \x00   \x00   \x00     \r    I    H    D      R
 \x00 \x00 \x01      , \x00 \x00 \x00  \x96   \x08   \x06   \x00   \x00  \x00    d    [  \xb5
 \xd2 \x00 \x00  \x05  \x12    I    D     A      j      C   \x04   \x88, \x05 \x84    +     =
    A    {   \t  \xd0\x08\x02\xc2\x15\xa9\x8c\x92 0\x16\x90,5\x85\xec'\xc0 K<\x01\xe4\x08\xe8%\xfbKy=\xc0\x00\x00\x00\x12QS\x91+\x90\x98"
>>> type(byte_array)
<type 'str'>
>>> map(ord, byte_array[0:50])
[137,  80,  78,  71,  13,  10,  26,  10,   0,   0,   0,  13,  73,  72,  68,  82,
   0,   0,   1,  44,   0,   0,   0, 150,   8,   6,   0,   0,   0, 100,  91, 181,
 210,   0,   0,   5,  18,  73,  68,  65,|106,  67,   4, 136,  44,   5, 132,  43,
  61,  65]                              |
                                        |
[137,  80,  78,  71,  13,  10,  26,  10,|  0,   0,   0,  13,  73,  72,  68,  82,
   0,   0,   1,  44,   0,   0,   0, 150,|  8,   6,   0,   0,   0, 100,  91, 181,
 210,   0,   0,   5,  18,  73,  68,  65,| 84, 120,  94, 237, 212, 193, 105,   4,
   81, 12,                              |
                                        |
                              They differ from byte 40 onwards (counting from 0)

  We know the python one is acceptable to MS's face api.

%89 P N G %0D %0A %1A %0A %00 %00 %00 %0D I H D R
%00 %00 %01 %2C %00 %00 %00 %96 %08 %06 %00 %00 %00 d %5B %B5
%D2 %00 %00 %05 %12 I D A | T x %5E %ED %D4 %C1 i %04  Q %0C.........
                          |
			  |



*/
    function convert_old(canvas) {
	var data = canvas.toDataURL('image/png');
	console.log(data);
    }


    function convert_new(canvas, context) {
	console.log(context.getImageData(0,0, canvas.width, canvas.height));


	return;
	
	var data = canvas.toDataURL('image/png');
	var data2 = escape(atob(data.split(",")[1]))
	console.log(data2);
	var data_bin_str = ""

	for(i=0; i< 50; i++) {
	    var d = data2[i].charCodeAt(0).toString(10);
	    data_bin_str += d + ", ";
	}

	console.log(data_bin_str);
	
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

    
    function dostuff() {
	var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

	console.log(context, canvas)

	context.fillStyle = '#cfa';
	context.fillRect(10,20,30,40);



	convert_old(canvas);
	convert_new(canvas, context);	    
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
    
    
