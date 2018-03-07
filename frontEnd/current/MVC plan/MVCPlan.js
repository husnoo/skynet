// ** Model ** // Incoming data from backend - to replace with AJAX GET

var model = {
    // assuming engagment score are integers between -2 and +2
    "userID1": {
        "engagement": 1
    },
    "userID2": {
        "engagement": 2
    }
};

// ** Control ** // Extracting data from backend and passing it on to the front end

var control = {
    // Init // make it go!
    
    // Create object with key:value pairs userID:engagement from incoming data stream

    // Convert engagement values into integers between -2 an +2
};
    


// ** View ** // Front end

var view = {
    init: function() { // Initialize grid view 
        
        // set all grid cells to grey until colour data is ready

        this.render();
    },
    
    render: function(){ // Render grid view (refresh every time new data is recieved)
     
        // Store variables for DOM pointers to table cells 

        // Assign each new user to fixed cell 

        // Colour cells according to users' engagement 
        }
};
    
control.init(); // make it go!