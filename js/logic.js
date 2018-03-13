$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAuye1u9w6lqvR92y2QlK89pSd3lKSW1ho",
        authDomain: "sample-976ac.firebaseapp.com",
        databaseURL: "https://sample-976ac.firebaseio.com",
        projectId: "sample-976ac",
        storageBucket: "sample-976ac.appspot.com",
        messagingSenderId: "21091739234"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    

    //initial variables
    var player1 = "",
        player2 = "",
        playerID;// track which player on document

    $("#submit").on("click", function(){
        
        if (playerID === 0){ //set player 1 data
            player1 = $("#playerName").val();
            var ref = database.ref("player/" + playerID);
            ref.set({
                name: player1,
                win: 0,
                lose: 0
            });
            sessionStorage.setItem("playerID", 0);
            hide()

        } else if (playerID === 1) { //set player 2 data
            player2 = $("#playerName").val();
            var ref = database.ref("player/" + playerID);
            ref.set({
                name: player2,
                win: 0,
                lose: 0
            });
            sessionStorage.setItem("playerID", 1); 
            hide();
        };

    });

    function hide (){
        $("#submit").hide();
        $("label").hide();
        $("#playerName").hide();
    }

    

    // when data change in database
    database.ref("player").on("value", response, error)

    function response(res) {

        console.log(res.val());
        //sets which player on window
        if (res.child(0).exists()){
            playerID = 1;
        } else {
            playerID =0
        }
        
    };

    function error(err){
        console.log(err)
    }

    //clears player information when navigate away from window
    $(window).on("unload", function(){
        var playerRecord = sessionStorage.getItem("playerID");
        database.ref("player/"+ playerRecord).remove();
        sessionStorage.clear();
    })


$("#console").click (function(){
    console.log("player ID is: " + playerID)
})


});

