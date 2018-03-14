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
        playerID,// track which player on document
        //rps is to show guesses in the middle of screen
        rps = [
            '<i class="fas fa-hand-rock"></i>',
            '<i class="fas fa-hand-paper"></i>',
            '<i class="fas fa-hand-scissors"></i>'
        ];

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
            $("#p0w").text(res.val()[0].win);
            $("#p0l").text(res.val()[0].lose);
            $("#player0 .rps").removeClass("hidden");
        } else {
            $(".p0").text("PLAYER");
            $("#player0 .rps").addClass("hidden");
        }

        //when player2 logs in
        if (res.child(1).exists()) {
            //show player2 name and choices
            $(".p1").text(res.val()[1].name);
            $("#p1w").text(res.val()[1].win);
            $("#p1l").text(res.val()[1].lose);
            $("#player1 .rps").removeClass("hidden");
        } else {
            $(".p1").text("PLAYER");
            $("#player1 .rps").addClass("hidden");
        }

        //when both players logged in, enable chat room
        if (res.child(0).exists() && res.child(1).exists()) {
            $(".chatbox").removeClass("disabled");
            $(".chat").addClass("dropshadow");
            
        } else {
            $(".chatbox").addClass("disabled");
            $(".chat").removeClass("dropshadow");
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
                    updateAndReset(player1choice, player1win, player1lose, player2choice, player2win, player2lose, showResult);
                    break;

                case -1:

                    showResult = res.val()[1].name + " wins!";
                    player2win++;
                    player1lose++;
                    updateAndReset(player1choice, player1win, player1lose, player2choice, player2win, player2lose, showResult);

                    break;

                case 0:
                    showResult = "it's a tie";
                    updateAndReset(player1choice, player1win, player1lose, player2choice, player2win, player2lose, showResult);
                    break;

                case 1:

                    showResult = res.val()[0].name + " wins!";
                    player1win++;
                    player2lose++;
                    updateAndReset(player1choice, player1win, player1lose, player2choice, player2win, player2lose, showResult);
                    break;

                case 2:

                    showResult = res.val()[1].name + " wins!";
                    player2win++;
                    player1lose++;
                    updateAndReset(player1choice, player1win, player1lose, player2choice, player2win, player2lose, showResult);
                    break;


                    //reset choices and count wins and loses
                    function updateAndReset(p1choice, p1win, p1lose, p2choice, p2win, p2lose, message) {

                        var p1guessP = $("<p class = 'showguess'>").html(res.val()[0].name + " chooses: " + rps[p1choice]);
                        var p2guessP = $("<p class = 'showguess'>").html(res.val()[1].name + " chooses: " + rps[p2choice]);
                        var result = $("<p class = 'showguess'>").html(message);
                        $(".p0guess").append(p1guessP);
                        $(".p1guess").append(p2guessP);
                        $("#result").append(result);

                        database.ref("player/0").update({
                            choice: "",
                            win: p1win,
                            lose: p1lose
                        });
                        database.ref("player/1").update({
                            choice: "",
                            win: p2win,
                            lose: p2lose
                        });


                        setTimeout(function () {//timeout before reset
                            $("i").removeClass("disabled");
                            $(".p0guess").empty();
                            $(".p1guess").empty();
                            $("#result").empty();
                        }, 3000)

                    };

            };



        };

    };



    function error(err) {
        console.log(err)
    }

    // when first player clicks on any of the choices
    $("#player0 .rps").on("click", function () {
        if (sessionStorage.getItem("playerID") == 0) {
            var choiceVal = $(this).attr("data")
            $(this).siblings(":not(.results)").addClass("disabled");
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
            $(this).siblings(":not(.results)").addClass("disabled");
            database.ref("player/1").update({ choice: choiceVal });

            // send a notifcation message to the other player on chat
            var StoredName = sessionStorage.getItem("name");
            database.ref("chat").set({
                name: StoredName,
                message: "I made my choice!"
            });
        };
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

    database.ref("chat").on("value", chatResponse)//send chat data to db

    function chatResponse(res) {
        if (res.child("name").exists()) {
            chatData = res.val();
            var newP = $("<p class= 'mychat'>"),
                spanName = $("<span class = 'font-weight-bold'>").text(chatData.name + ": "),
                spanChat = $("<span>").text(chatData.message);
            newP.append(spanName, spanChat);
            $(".room").append(newP);
            var audio = new Audio('./media/chat.wav');
            audio.play();
        }
    }

    //press Enter will click on the chat button
    $('#chatinput').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $("#chat").click();
            return false;
        }
    });

    //clears player information when navigate away from window
    $(window).on("unload", function () {
        var playerIndex = sessionStorage.getItem("playerID");
        var StoredName = sessionStorage.getItem("name");
        database.ref("player/" + playerIndex).remove();


        sessionStorage.clear();
    })


});



