// Assuming maximum 64 users (students) so 8x8 grid

// ** Model ** // Incoming data from backend - 
//to replace with AJAX GET method when we have a the real data stream 
//from our backend
// Order of user IDs may change in real data stream

var model = {
    "userID1": {
        "engagement": 2
    },
    "userID2": {
        "engagement": 1
    }
};

// ** Control ** // Extracting data from backend and passing it on to the front end

var control = {
    // Init // make it go!
        // Set all grid cells as unassigned (initially)
    
    // Get current data snapshot from incoming data stream
        getCurrentData: function(){
            return model; // getting static snapshot of the data is important 
            //because order of users may change
            // in direct data feed from the server
        },
    // Creating userID:cell 
        // extract array of user IDs from data object snapshot
        extractUserIDs: function() {
            var currentData = this.getCurrentData(); // snapshot from data stream
            var UserIDs = Object.keys(currentData); 
            return UserIDs; // outputs array [0:userID1; 1:userID2 ...]
        }, 
        // extract array of engagements from data object snapshot
        createEngagements: function(){ 
            var currentData = this.getCurrentData();
            console.log("current data is: " + currentData);
            var currentUserIDs = this.extractUserIDs();
            console.log("currentUserIDs are: "+ currentUserIDs);
            for (i=0; i<currentUserIDs.length; i++){
                console.log("i is : " + i);
                var currentUser = currentUserIDs[i]; 
                console.log("current user is: " + currentUser);
                //var currentEngagement = currentData.userID1.engagement;
                var currentEngagement = currentData[currentUser].engagement;
                console.log("current engagement value: " + )
            }
        }
    // Assign each NEW user a fixed cell 

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
control.createEngagements();