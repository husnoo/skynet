A0 = document.getElementById("A0"); // select cell by ID
A1 = document.getElementById("A1"); // select cell by ID
A2 = document.getElementById("A2"); // select cell by ID
B0 = document.getElementById("B0"); // select cell by ID
B1 = document.getElementById("B1"); // select cell by ID
B2 = document.getElementById("B2"); // select cell by ID
C0 = document.getElementById("C0"); // select cell by ID
C1 = document.getElementById("C1"); // select cell by ID
C2 = document.getElementById("C2"); // select cell by ID


function switchColour (score, cell){
    currentCell = cell; // set current cell
    switch (score) {
        case -2:
            console.log("score is -2 so colour is red");
            currentCell.style.backgroundColor = "#dd2c00";// red set selected cell's colour
            break;

        case -1:
            console.log("score is -1 so colour is orange");
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
switchColour(-2, A0); // specify score,cell
switchColour(-1, A1); // specify score,cell
switchColour(-0, A2); // specify score,cell
switchColour(2, B0); // specify score,cell
switchColour(-1, B1); // specify score,cell
switchColour(-0, B2); // specify score,cell
switchColour(-2, C0); // specify score,cell
switchColour(1, C1); // specify score,cell
switchColour(-0, C2); // specify score,cell

