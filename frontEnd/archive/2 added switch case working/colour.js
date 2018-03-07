A0 = document.getElementById("A0"); // select cell by ID
A1 = document.getElementById("A0"); // select cell by ID

//var score = 1; // engagement score simulation (-2 < score < 2)
// switch case

function switchColour (score){

    switch (score) {
        case -2:
            console.log("score is -2 so colour is red");
            A0.style.backgroundColor = "red";// set selected cell's colour
            break;

        case -1:
            console.log("score is -1 so colour is organge");
            A0.style.backgroundColor = "#ff6d00";// set selected cell's colour (orange)
            break;
        
        case 0:
            A0.style.backgroundColor = "yellow";// set selected cell's colour
            break;

        case 1:
            A0.style.backgroundColor = "rgb(190,255,0)";// set selected cell's colour (yellowish-green)
            break;

        case 2:
            A0.style.backgroundColor = "green";// set selected cell's colour
            break;

        default:
            A0.style.backgroundColor = "grey";
            break;
    };
}

switchColour(2); // specify score

// 
//