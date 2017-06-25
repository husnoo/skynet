A0 = document.getElementById("A0"); // select cell by ID
A1 = document.getElementById("A1"); // select cell by ID
A2 = document.getElementById("A2"); // select cell by ID

// function selectCell (cell){
//     currentCell = cell;
//     currentCell.style.backgroundColor = "red";
// }

// function colourCell (colour,cell){
//      currentCell = cell;
//      currentCell.style.backgroundColor = colour;// set selected cell's colour (orange)
// }

function switchColour (score, cell){
    currentCell = cell; // set current cell
    switch (score) {
        case -2:
            console.log("score is -2 so colour is red");
            
            currentCell.style.backgroundColor = "#dd2c00";// red set selected cell's colour
            break;

        case -1:
            console.log("score is -1 so colour is organge");
            A0.style.backgroundColor = "#ffa726";// set orange selected cell's colour (orange)
            break;
        
        case 0:
            A0.style.backgroundColor = "#ffeb3b";// yellow set selected cell's colour
            break;

        case 1:
            A0.style.backgroundColor = "#b2ff59";// yellow-green set selected cell's colour (yellowish-green)
            break;

        case 2:
            A0.style.backgroundColor = "#64dd17";// green set selected cell's colour
            break;

        default:
            A0.style.backgroundColor = "grey";
            break;
    };
}
switchColour(-2, A0); // specify score,cell
switchColour(-1, A1); // specify score,cell
switchColour(-0, A2); // specify score,cell

// 
//