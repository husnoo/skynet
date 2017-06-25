// Assuming maximum 64 users (students) so 8x8 grid

// ** Model ** // Incoming data from backend - 
//to replace with AJAX GET method when we have a the real data stream 
//from our backend

var model = {
    "userID1": {
        "engagement": 1.0
    },
    "userID2": {
        "engagement": 0.9
    }
};

// ** Control ** // Extracting data from backend and passing it on to the front end

var control = {
    // Init // make it go!
        // Set all grid cells as unassigned (initially)
    
    // Get current data snapshot#
        getCurrentData: function(){
            return model; // getting static snapshot of the data is important 
            //because order of users may change
            // in direct data feed from the server
        },

    // Create object with key:value pairs userID:engagement from incoming data stream
        extractUserIDs: function() {
            var UserIDs = Object.keys(model);
        //console.log(UserIDs); // outputs [0:userID1; 1:userID2 ...]
            return UserIDs;
        },
        extractEngagementsData: function(){
            for (i=0; i<UserIDs.length; i++){
                console.log(i);
                var currentData  
            }
            

        }
    // Assign each new user a fixed cell 

    // Compare previous data object to current one to keep 

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
    
//control.init(); // make it go!
control.extractUserIDs();