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

        //when player1 logs in
        if (res.child(0).exists()) {
            //show player1 name and chioces
            $(".p0").text(res.val()[0].name);
            $("#player0 .rps").removeClass("hidden");
        } else {
            $(".p0").text("PLAYER");
            $("#player0 .rps").addClass("hidden");
        }

        //when player2 logs in
        if (res.child(1).exists()) {
            //show player2 name and choices
            $(".p1").text(res.val()[1].name);
            $("#player1 .rps").removeClass("hidden");
        } else {
            $(".p1").text("PLAYER");
            $("#player1 .rps").addClass("hidden");
        }

        //when both players logged in, enable chat room
        if (res.child(0).exists() && res.child(1).exists()) {
            $(".chatbox").removeClass("disabled")
        } else {
            $(".chatbox").addClass("disabled")
        }

        //only when both players exist and they made choices
        if (res.child(0).exists() && res.child(1).exists() && res.val()[0].choice != "" && res.val()[1].choice != "") {
            var showResult = "",
                player1choice = parseInt(res.val()[0].choice),
                player1win = parseInt(res.val()[0].win),
                player1lose = parseInt(res.val()[0].lose),
                player2choice = parseInt(res.val()[1].choice),
                player2win = parseInt(res.val()[1].win),
                player2lose = parseInt(res.val()[1].lose);
            //console.log(player1choice, player1win, player1lose, player2choice, player2win, player2lose);


            switch (player1choice - player2choice) { //compares user's input against computer
                case -2: //user wins

                    showResult = res.val()[0].name + " wins!";
                    player1win++;
                    player2lose++;

                    /*will code new function that does 2 updates:
                    reset choices to break if statment add wins and loses to both players
                    timeout for dom reset
                    */

                    console.log(showResult)
                    updateAndReset(player1win, player1lose, player2win, player2lose);
                    break;

                case -1:

                    showResult = res.val()[1].name + " wins!";
                    player2win++;
                    player1lose++;
                    console.log(showResult)
                    updateAndReset(player1win, player1lose, player2win, player2lose);

                    break;

                case 0:
                    showResult = "it's a tie";
                    console.log(showResult)
                    updateAndReset(player1win, player1lose, player2win, player2lose);
                    break;

                case 1:

                    showResult = res.val()[0].name + " wins!";
                    player1win++;
                    player2lose++;
                    console.log(showResult)
                    updateAndReset(player1win, player1lose, player2win, player2lose);
                    break;

                case 2:

                    showResult = res.val()[1].name + " wins!";
                    player2win++;
                    player1lose++;
                    console.log(showResult)
                    updateAndReset(player1win, player1lose, player2win, player2lose);
                    break;


                    //reset choices and count wins and loses
                    function updateAndReset(p1win, p1lose, p2win, p2lose) {
                        database.ref("player/0").update({
                            choice: "",
                            win: p1win,
                            lose: p1lose
                        })
                        database.ref("player/1").update({
                            choice: "",
                            win: p2win,
                            lose: p2lose
                        })

                    };

            };



        }

    };



    function error(err) {
        console.log(err)
    }

    // when first player clicks on any of the choices
    $("#player0 .rps").on("click", function () {
        if (sessionStorage.getItem("playerID") == 0) {
            var choiceVal = $(this).attr("data")
            $(this).siblings().addClass("disabled");
            database.ref("player/0").update({ choice: choiceVal });


            // send a notifcation message to the other player on chat
            var StoredName = sessionStorage.getItem("name");
            database.ref("chat").set({
                name: StoredName,
                message: "I made my choice!"
            });

        };
    })
    //when second player clicks on any of the choices
    $("#player1 .rps").on("click", function () {
        if (sessionStorage.getItem("playerID") == 1) {
            var choiceVal = $(this).attr("data")
            $(this).siblings().addClass("disabled");
            database.ref("player/1").update({ choice: choiceVal });

            // send a notifcation message to the other player on chat
            var StoredName = sessionStorage.getItem("name");
            database.ref("chat").set({
                name: StoredName,
                message: "I made my choice!"
            });
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
        if (res.child("name").exists()) {
            chatData = res.val();
            var newP = $("<p class= 'mychat'>"),
                spanName = $("<span class = 'font-weight-bold'>").text(chatData.name + ": "),
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



