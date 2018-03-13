$(document).ready(function () {
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

    //clear stored chat
    database.ref("chat").remove();


    //initial variables
    var player1 = "",
        player2 = "",
        playerID;// track which player on document

    $("#submit").on("click", function () {

        if (playerID === 0) { //set player 1 data
            player1 = $("#playerName").val();
            var ref = database.ref("player/" + playerID);
            ref.set({
                name: player1,
                win: 0,
                lose: 0,
                choice: ""
            });
            sessionStorage.setItem("playerID", 0);
            sessionStorage.setItem("name", player1);
            hide()

        } else if (playerID === 1) { //set player 2 data
            player2 = $("#playerName").val();
            var ref = database.ref("player/" + playerID);
            ref.set({
                name: player2,
                win: 0,
                lose: 0,
                choice: ""
            });
            sessionStorage.setItem("playerID", 1);
            sessionStorage.setItem("name", player2);


            hide();
        };

    });

    function hide() {
        $("#submit").fadeOut();
        $("label").fadeOut();
        $("#playerName").fadeOut();
    }



    // when data change in database
    database.ref("player").on("value", response, error)


    //HERE WHERE ALL THE FUN HAPPENS
    function response(res) {

        // console.log(res.val());
        //sets which player on window
        if (res.child(0).exists()) {
            playerID = 1;
        } else {
            playerID = 0
        }


        if (res.child(0).exists()) {
            $(".p0").text(res.val()[0].name);
            $("#player0 i").removeClass("hidden");
        } else {
            $(".p0").text("PLAYER");
            $("#player0 i").addClass("hidden");
        }

        //shows player information on html
        if (res.child(1).exists()) {
            $(".p1").text(res.val()[1].name);
            $("#player1 i").removeClass("hidden");
        } else {
            $(".p1").text("PLAYER");
            $("#player1 i").addClass("hidden");
        }

        if(res.child(0).exists() && res.child(1).exists()){
            $(".chatbox").removeClass("disabled")
        } else {
            $(".chatbox").addClass("disabled")
        }


    };



    function error(err) {
        console.log(err)
    }

    // when first player clicks on any of the choices
    $("#player0 i").on("click", function () {
        if (sessionStorage.getItem("playerID") == 0) {
            var choiceVal = $(this).attr("data")
            $(this).siblings().addClass("disabled");
            database.ref("player/0").update({choice: choiceVal})

        };
    })
    //when second player clicks on any of the choices
    $("#player1 i").on("click", function () {
        if (sessionStorage.getItem("playerID") == 1) {
            var choiceVal = $(this).attr("data")
            $(this).siblings().addClass("disabled");
            database.ref("player/1").update({choice: choiceVal})
        };
    })

    
    // A BUTTON FOR TESTING
    $("#console").click(function () {
        console.log("player ID is: " + playerID)
    })
    
    
    //chat functionality
    $("#chat").on("click", function () {
        var StoredName = sessionStorage.getItem("name");
        database.ref("chat").set({
            name: StoredName,
            message: $("#chatinput").val().trim()
        });
        $("#chatinput").val("");
    })
    
    database.ref("chat").on("value", chatResponse)
    
    function chatResponse(res) {
        if(res.child("name").exists()){
        chatData = res.val();
        var newP = $("<p class= 'mychat'>"),
            spanName = $("<span class = 'font-weight-bold'>").text(chatData.name+ ": "),
            spanChat = $("<span>").text(chatData.message);
            newP.append(spanName, spanChat);
            $(".room").append(newP);    
        }
    }
    
    
    //clears player information when navigate away from window
    $(window).on("unload", function () {
        var playerIndex = sessionStorage.getItem("playerID");
        var StoredName = sessionStorage.getItem("name"); 
        database.ref("player/" + playerIndex).remove();

        sessionStorage.clear();
    })


});



