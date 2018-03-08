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
        player2 = "";

    $("#submit").on("click", function(){
        if (player1 === ""){
            player1 = $("#playerName").val();
            var ref = database.ref("player/1");
            ref.set({
                name: player1,
                win: 0,
                lose: 0
            });
        
        } else {
            player2 = $("#playerName").val();
            var ref = database.ref("player/2");
            ref.set({
                name: player2,
                win: 0,
                lose: 0
            });
        };

    });
});