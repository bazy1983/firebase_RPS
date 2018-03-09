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
    //database.ref();

    //initial variables
    var player1 = "",
        player2 = "",
        playerID;// track which player on document

    $("#submit").on("click", function(){
        console.log ("player on this window: " + playerID)
        if (playerID === 0){ //set player 1 data
            player1 = $("#playerName").val();
            var ref = database.ref("player/0");
            ref.set({
                name: player1,
                win: 0,
                lose: 0
            });
            hide()
            sessionStorage.setItem("playerID", 0);

        } else if (playerID === 1) { //set player 2 data
            player2 = $("#playerName").val();
            var ref = database.ref("player/1");
            ref.set({
                name: player2,
                win: 0,
                lose: 0
            });
            hide();
            sessionStorage.setItem("playerID", 1); 
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
        if (res.val() === null){
            playerID = 0;
        } else {
            playerID = 1
        }
        
    };

    function error(err){
        console.log(err)
    }

    //clears player information when navigate away from window
    $(window).on("unload", function(){
        database.ref("player/"+ sessionStorage.getItem("playerID")).remove();
    })


$("#console").click (function(){
    console.log(sessionStorage.getItem("playerID"))
})


});

