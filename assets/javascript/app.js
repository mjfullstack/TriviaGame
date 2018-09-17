$(document).ready(function(){
    // Add clobal vars to control how much gets console.logged after debugging that section of code.
    var DEBUG = false;
    var CURR_DEBUG = true;

    /*******************/
    /****   VARS    ****/
    /*******************/
    // Game Object: SET Game parameters with list of 10 of the 16 possible raw candy objects
    var gameObj = {
        // Vars
        // Game Size, Raw Candy Bar Instantiations, and how many will be selected per game
        numOfRawCandy    : 16,
        numOfQsPerGame   : 10,
        currQuestion     : 0,
        initialPageLoad  : true,
        numOfAnsPerQ     : 4,  // This may become randomized later, but for now, we're starting with fixed at 4
        gameQListNums    : [], // Index numbers for which 10 of the 16 candy objects will be used in this game.
        gameQsObjectsObj : {}, // Collection in an object of the actual Candy object of each candy / question in this game
        objNamesArr      : [], // Capture the object names we created while consuming raw candy in an array

        // Methods
        fillWrongAnsStrArr : function(qObjNum) {
            for (var i=0; i< this.numOfAnsPerQ; i++) {
                this.gameQsObjectsObj[qObjNum].wrongAnsStrArr[i] = this.gameQsObjectsObj[this.gameQsObjectsObj[qObjNum].wrongAnsNumsArr[i] ].name;
                this.gameQsObjectsObj[qObjNum].spareWrongAns     = this.gameQsObjectsObj[this.gameQsObjectsObj[qObjNum].wrongAnsNumsArr[i+1]].name;
                if (DEBUG) {
                console.log("this.gameQsObjectsObj[qObjNum].spareWrongAns = " + this.gameQsObjectsObj[qObjNum].spareWrongAns);
                }
            }
            if (DEBUG) {
                console.log("============= fillWrongAnsStrArr Start ==========================================")
                console.log("qObjNum = " + qObjNum);
                console.log(this.gameObj);
                console.log(this.gameQsObjectsObj[qObjNum].prototype, "object", rawCandy[qObjNum], "prop value", "line 25");
                console.log("this.QsObjObj[qObjNum] = " + this.gameQsObjectsObj[qObjNum].printStats());
                console.log("=============  fillWrongAnsStrArr End  ==========================================")
            };
        },
        
        fillAllWrongAns  : function() {
            // for (var j=0; j< this.gameQListNums.length; j++) { // NOTE: May want to do ALL 16 candy objects vs the 10 we are using
            for (var j=0; j< this.numOfRawCandy; j++) { // NOTE: May want to do ALL 16 candy objects vs the 10 we are using
                if (DEBUG) {
                    // console.log(Object.keys(gameObj.gameQsObjectsObj[j]));
                };
                this.fillWrongAnsStrArr(j);
            };
        },

        fillPresentedAns : function () {
            if (DEBUG) {
                // console.log("this.QsObjObj[j] = " + this.gameQsObjectsObj[j].printStats() ); // Reference
            };
            for( var k=0; k < this.gameQListNums.length; k++) {
                var currQItemNum = this.gameQListNums[k];
                for( var ii = 0; ii < this.numOfAnsPerQ; ii++) {
                    if ( ii === this.gameQsObjectsObj[currQItemNum].corrAnsLoc) {
                        this.gameQsObjectsObj[currQItemNum].presentedAnswers[ii] = this.gameQsObjectsObj[currQItemNum].name;
                    } else if (this.gameQsObjectsObj[currQItemNum].name === this.gameQsObjectsObj[currQItemNum].wrongAnsStrArr[ii]) {
                        this.gameQsObjectsObj[currQItemNum].presentedAnswers[ii] = this.gameQsObjectsObj[currQItemNum].spareWrongAns;
                        if (DEBUG) {
                            console.log("HAD TO USE SPARE: this.gameQsObjectsObj[currQItemNum].presentedAnswers[ii] = " + this.gameQsObjectsObj[currQItemNum].presentedAnswers[ii]);
                        }
                    } else {
                        this.gameQsObjectsObj[currQItemNum].presentedAnswers[ii] = this.gameQsObjectsObj[currQItemNum].wrongAnsStrArr[ii];
                    }
                };
                if (DEBUG) {
                    console.log("============= fillPresentedAns Start ===========================================")
                    console.log("this.QsObjObj[k] = " + this.gameQsObjectsObj[k].printStats());
                    console.log("=============  fillPresentedAns End  ===========================================")
                };
            };
        },

        genQListArr      : function () {
            this.getRandNoRepeat( this.numOfQsPerGame, this.numOfRawCandy, this.gameQListNums)
        },

        getRandNoRepeat : function( numOfItems, rangeIn, arrayToFill ) {
            // Get First one, then enter loop to get rest that checks 
            // against what has already been generated for no duplicate
            // numbers.
            var numOfItemsFound = 0;
            var randNum = Math.floor(Math.random() * rangeIn); // Get the first one...
            arrayToFill.push(randNum); 
            numOfItemsFound++;
            // Then enter loop
            while( numOfItemsFound < numOfItems ) {
                randNum = Math.floor(Math.random() * rangeIn);
                var found = false;
                for (var i=0; i<arrayToFill.length; i++) {
                    if (randNum === arrayToFill[i] )
                        found = true;
                };
                if (!found) {
                    arrayToFill.push(randNum);
                    numOfItemsFound++;
                };
                if (DEBUG) {
                    console.log("arrayToFill = " + arrayToFill)
                };
            };
        },

        setCorrAnsLoc    : function() {
            // Range in is the number of buttons / choices per question
            return getRandNum(this.numOfAnsPerQ);
        }
    };

    // Game stats
    gameStats= {
        // Vars
        totalQsToAsk  : gameObj.numOfQsPerGame, // 10, // Could be randomized later
        ansCorrect    : 0, // Set at beginning of app and at restart
        ansInCorrect  : 0, // Set at beginning of app and at restart
        unAnswered    : 0,
        gameOver      :  false,
        totalQsCmpl   : function () { return ( this.ansCorrect + this.ansInCorrect + this.unAnswered ) },
        printTotals   : function () {
            console.log("gameStats Print of printTotals")
            console.log("this.totalQsToAsk = " + this.totalQsToAsk);
            console.log("this.ansCorrect = " + this.ansCorrect);
            console.log("this.ansInCorrect = " + this.ansInCorrect);
            console.log("this.unAnswered = " + this.unAnswered);
            console.log("this.gameOver = " + this.gameOver);
            console.log("this.totalQsCmpl = " + this.totalQsCmpl());
            }
    };

    function postQuestion (kk) {
        // Now use jQuery to populate the HTML elements via tag class or id...
        if (DEBUG) {
            console.log("============= Start of jQuery Object  ===============");
            console.log("kk = " + kk + "; gameObj.gameQListNums[kk] = " +gameObj.gameQListNums[kk]);
            console.log("gameObj.gameQsObjectsObj[gameObj.gameQListNums[kk]].clue); = " + gameObj.gameQsObjectsObj[gameObj.gameQListNums[kk]].clue);
            console.log("gameObj.gameQsObjectsObj[gameObj.gameQListNums[kk]].presentedAnswers = " + gameObj.gameQsObjectsObj[gameObj.gameQListNums[kk]].presentedAnswers);
            console.log("=============  End of jQuery Object  ===============");
        };
        $("#ask-question").html("<h2>" + gameObj.gameQsObjectsObj[gameObj.gameQListNums[kk]].clue + "</h2>");
        
        for (var i = 0; i< gameObj.numOfAnsPerQ; i++) {
            $("#button-answer"+i).html("<h3>" + gameObj.gameQsObjectsObj[gameObj.gameQListNums[kk]].presentedAnswers[i] + "</h3>");
            };
        if (DEBUG) {
            gameObj.gameQsObjectsObj[gameObj.gameQListNums[kk]].printStats()
            gameStats.printTotals();
        };
        gameObj.currQuestion++;
    };

    function initGame() {
        gameStats.ansInCorrect = 0;
        gameStats.ansCorrect = 0;
        gameStats.unAnswered = 0;
        gameStats.printTotals();
        if (DEBUG) {
            console.log("gameObj.gameQsObjectsObj[jj].presentedAnswers" + gameObj.gameQsObjectsObj[jj].presentedAnswers);
            console.log("RE-START: gameStats.totalQsCmpl + gameStats.totalQsToAsk " + gameStats.totalQsCmpl() + ", " + gameStats.totalQsToAsk);
        };
        // gameStats.ansInCorrect++;
        // Initialize Attributes / Classes
        // TBD, timer, etc
    };

    function celebrateCorrAns() {
        if ( DEBUG) {
            console.log("celebrateCorrAns!!!");
        }
        var saveCurrentDisplay = $("#game-name").text();
        // More to come
        $("#game-name").text("CORRECT!").css("color" , "lime");
        var delayCorrDisp = setTimeout(function() {
            $("#game-name").text(saveCurrentDisplay); // Display this answer's result briefly
            $(".title-text").css("color" , "purple");
        }, 2000);
        // $(".title-text").css("color" , "purple");
        
    };

    function nonCelebrateWrongAns() {
        if ( DEBUG) {
            console.log("Troll them,humuliate them, They DIDN'T know their candies!!!");
        }
        var saveCurrentDisplay = $("#game-name").text();
        // alert("saveCurrentDisplay = " + saveCurrentDisplay);
        // More to come
        $("#game-name").text("NOPE!");
        $(".title-text ").css("color", "red");
        var delayInCorrDisp = setTimeout(function() {
            $("#game-name").text(saveCurrentDisplay); // Display this answer's result briefly
            $(".title-text ").css("color", "purple");
        }, 2000);
    };



    // Raw data for app
    // &#39; for ' - Apostrophe / Single Quote
    // &#34; for " - Double Quotes
    // Evens starting at 0 are candy names
    // Odds starting at 1 are clues for the preceding candy name.
    var rawCandy = [
	"Twix" , "Which candy claimed to have &#34chocolate, caramel and a surprising cookie crunch&#34?" ,
	"Heath Bar" , "Which candy had &#34a taste so good, it speaks for itself&#34?" ,
	"Snickers" , "Which candy &#34Really Satisfies&#34?" ,
	"Milky Way" , "Which candy claimed &#34You can almost hear it moo&#34?" ,
	"Kit Kat Bar" , "Which candy made you say “Give me  a break&#34?" ,
	"Oh, Henry" , " Which candy claimed “What makes it big, makes it good&#34?" ,
	"Skittles" , "Which candy claimed “Taste the Rainbow&#34?" ,
	"Carmello" , "Which candy claimed you could “Stretch it Out&#34?" ,
	"Nestle Crunch Bar" , "Which candy asked “Who taught chocolate to talk a lot?&#34?" ,
	"Reese&#39s Peanut Butter Cup" , "Which candy claimed to have &#34two great tastes that taste great together&#34?" ,
	"Hershey&#39s" , "Which candy was called the “Great American Candy Bar&#34?" ,
	"3 Musketeers" , "Which candy claimed that &#34With 3 big pieces, it&#39s a candy treat that can&#39t be beat&#34?" ,
	"M\&M&#39s" , "Which candy claimed that it “Melts in your mouth, not in your hand&#34?" ,
	"Mound&#39s" , "Which candy claimed “Sometimes you feel like a nut, sometimes you don&#39t&#34?" ,
	"100 Grand Bar" , "Which candy claimed to be “extra-rich in caramel&#34?" ,
	"York&#39s Peppermint Pattie" , "Which candy told you to “Get the Sensation&#34?"
    ];

    /*******************/
    /**** FUNCTIONS ****/
    /*******************/
    // Candy Object Constructor
    function  Candy ( name, clueIn, corrLocNum, wrongAnswerArrNums, wrongAnsStringArr ) {
        this.name             = name;
        this.clue             = clueIn; // 'Long' text string question: "Which candy...""
        this.corrAnsLoc       = corrLocNum; // Will be randomized 0 to 3 for which answer button to populate
        this.wrongAnsNumsArr  = wrongAnswerArrNums; // Array of 5, less 1 for Spare, so 4 values 0 to 15, no-repeat; Is which candyObjArr[item] to get a name from
        this.wrongAnsStrArr   = wrongAnsStringArr; // Array of 4 strings from Candy.name of 0 to 16 possible candy objects
        this.presentedAnswers = [];
        this.spareWrongAns    = ""; // Extra Candy Obj Name in case a wrong answer matches the current Q number.
    } ;

    // Candy Object Methods
    Candy.prototype.printStats = function() {
        console.log("Candy.prototype Print of printStats")
        console.log("this.name = " + this.name);
        console.log("this.clue = " + this.clue);
        console.log("this.corrAnsLoc = " + this.corrAnsLoc);
        console.log("this.wrongAnsNumsArr = " + this.wrongAnsNumsArr);
        console.log("this.wrongAnsStrArr = " + this.wrongAnsStrArr);
        console.log("this.presentedAnswers = " + this.presentedAnswers);
        console.log("this.spareWrongAns = " + this.spareWrongAns);
    };


    function getRandNum (rangeIn) {
        return Math.floor(Math.random() * rangeIn); // Correct answer location in 0 to 3
    };

    function displayFinalResults() {
        console.log("Displaying FINAL Score")
        gameStats.printTotals();
    }


    // Generate candy objects...
    var newObjName = {};
    var genCorrAnsLoc ;
    var wrongAnsArrNums = [];
    var genWrongAnsArr = [];
    function consumeRawCandy(numOfRawCandyIn) {
        if (DEBUG) {
            console.log("numOfRawCandyIn = " + numOfRawCandyIn);
        };
        var objCount = 0;
        for ( var i=0; i < 2*numOfRawCandyIn; i=i+2) {
            var newObjNameRaw = rawCandy[i]; // This is just the candy NAME, some with multiple words
            newObjNameRaw = newObjNameRaw.split(" "); //.join(""); //, rawCandy[i] );
            newObjNameRaw[0] = newObjNameRaw[0].toLowerCase(); // Better way to make first letter lowercase
            if (DEBUG) {
                console.log("newObjNameRaw = " + newObjNameRaw); // WORKS
            };
            var concatNewObjName = "";
            for ( var ii=0; ii<newObjNameRaw.length; ii++) {
                concatNewObjName += newObjNameRaw[ii];
                newObjName = concatNewObjName;
            };
            gameObj.objNamesArr.push(newObjName);
            genCorrAnsLoc = gameObj.setCorrAnsLoc();
            wrongAnsArrNums = [];
            genWrongAnsArr = ["Big", "Bad", "Black", "Bear"];
            if (DEBUG) {
                console.log("concatNewObjName = " + concatNewObjName + "; newObjName = " + newObjName );
                console.log("gameObj.objNamesArr[objCount] = " + gameObj.objNamesArr[objCount] + "  objCount = " + objCount);
            };
            // gameObj.getRandNoRepeat(gameObj.numOfAnsPerQ, gameObj.numOfQsPerGame, wrongAnsArrNums);
            gameObj.getRandNoRepeat(gameObj.numOfAnsPerQ+1, gameObj.numOfRawCandy, wrongAnsArrNums);
            if (DEBUG) {
                console.log("In consumeRawCandy, wrongAnsArrNums = " + wrongAnsArrNums);
            };
            newObjName = new Candy( rawCandy[i], rawCandy[i+1], genCorrAnsLoc, wrongAnsArrNums, genWrongAnsArr);
            if (DEBUG) {
                console.log("newObjName.name = " + newObjName.name );
            };
            // gameObj.gameQsObjectsObj.push(newObjName);
            gameObj.gameQsObjectsObj[objCount] = newObjName; // "Compiles"
            if (DEBUG) {
                console.log("************ consumeRawCandy Start ******************");
                console.log(gameObj.gameQsObjectsObj[objCount]); // Correctly shows each object here
                console.log("************  consumeRawCandy End  ******************");
                // newObjName.printStats(); // BOTH THESE WORK
                gameObj.gameQsObjectsObj[objCount].printStats();
            };
            objCount++;
        };
    };

    // Call my consumeRawCandy function here...
    consumeRawCandy(gameObj.numOfRawCandy); // This call and the function WORK, 09/09/18

    gameObj.genQListArr();
    if (DEBUG) {
        // Display this games parameters
        console.log("Display this games parameters...")
        console.log("gameObj.numOfRawCandy = " + gameObj.numOfRawCandy);
        console.log("gameObj.numOfQsPerGame = " + gameObj.numOfQsPerGame);
        console.log("gameObj.gameQListNums = " + gameObj.gameQListNums);
    };

    // Populate the Objects wrong answers and presented answers - via FOR-loops
    // Populate the game object wrong answer names array with the text values of the wrongAnsArrNums
    gameObj.fillAllWrongAns();
    // Now populate the gameQsObjectsObj[x].presentedAns to complete the gameQsObjectsObj[x] item.
    gameObj.fillPresentedAns(); // This places the correct name at the correc answer's loc and wrong answers in the other three locations

    // Test Code: console.log all the objects in the gameObj.gameQsObjectsObj[jj], S/B 16 Items
    for (var jj=0; jj<gameObj.gameQsObjectsObj.length; jj++) {
        if (DEBUG) {
            console.log("============= Start of Question Object ===============");
            console.log("ggameObj.gameQsObjectsObj.length = " + gameObj.gameQsObjectsObj.length);
            console.log("gameObj.gameQListNums[jj] = " + gameObj.gameQListNums[jj] + "jj = " + jj);
            console.log("gameObj.gameQsObjectsObj[gameObj.gameQListNums[jj]].clue = " + gameObj.gameQsObjectsObj[gameObj.gameQListNums[jj]].clue);
            console.log(gameObj.gameQsObjectsObj[gameObj.gameQListNums[jj]].printStats);
            console.log("=============  End of Question Object  ===============");
        };
    };

    if (DEBUG) {
        console.log("gameObj.initialPageLoad = " + gameObj.initialPageLoad);
    }

    // Hide game Q & A until start button is pressed
    $(".button-answer-sel").hide();
    $("#ask-question").hide();
    $("#timer-text").hide();

    
    /////////////////////
    // RE-START BUTTON //
    /////////////////////
    $("#button-re-start").hover( function () {
        $("#button-re-start").css("background-color", "blue");
    }, function () {
        $("#button-re-start").css("background-color", "purple");
    } );
    // $(".button-start-re-start").on("click", function() {
        $("#button-re-start").on("click", function() {
            // Initialize Vars
            $("#button-re-start").css("background-color", "purple");    
            if (DEBUG) {
                console.log("That's the RE-START button!");
                console.log("gameObj.initialPageLoad = " + gameObj.initialPageLoad);
            };
            if ( !gameObj.initialPageLoad) {
                initGame();
            };
            // Done with initial page load and start button pressed!
            gameObj.initialPageLoad = false;
            // Show question and Answer buttons
            $(".button-answer-sel").show();
            $("#ask-question").show();
            $("#timer-text").show();
            // Set up timer and post the question
            stopwatch.stop();
            stopwatch.reset();
            postQuestion(gameObj.currQuestion); // currQuestion incremented at the end of the function.
            stopwatch.start();

    } );

// #button-answer0, #button-answer1, #button-answer2, #button-answer3"
    $("#button-answer0").hover( function () {
        $("#button-answer0").css("background-color", "orange");
    }, function () {
        $("#button-answer0").css("background-color", "purple");
    } );
    $("#button-answer1").hover( function () {
        $("#button-answer1").css("background-color", "orange");
    }, function () {
        $("#button-answer1").css("background-color", "purple");
    } );
    $("#button-answer2").hover( function () {
        $("#button-answer2").css("background-color", "orange");
    }, function () {
        $("#button-answer2").css("background-color", "purple");
    } );
    $("#button-answer3").hover( function () {
        $("#button-answer3").css("background-color", "orange");
    }, function () {
        $("#button-answer3").css("background-color", "purple");
    } );
    $(".button-answer-sel").on("click", function() {
        $(".button-answer-sel").css("background-color", "purple");
        // Identify button clicked
        if (DEBUG) {
            console.log("That's the answer button group!");
            console.log("ANSWER-SEL: gameStats.totalQsCmpl + gameStats.totalQsToAsk " + gameStats.totalQsCmpl() + ", " +  gameStats.totalQsToAsk);
        };

        // Get the specific ID from the button clicked
        ansSelected = "#" + $(this).attr("id");
        ansSelected = ansSelected[ansSelected.length-1];
        // alert('$(this).attr("id") = ' + $(this).attr("id") + "; ansSelected = " + ansSelected);
        if (DEBUG) {
            // console.log("ON CLICK ANSWER-SEL: ansSelected = " + ansSelected + "; ansSelected[ansSelected.length-1] = " + ansSelected[ansSelected.length-1]);
            console.log("ansSelected = " + ansSelected + "; ");
            console.log("gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ].corrAnsLoc = " + gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ].corrAnsLoc);
            if (+ansSelected === gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ].corrAnsLoc) {
                console.log("ON CLICK ANSWER-SEL: +ansSelected DID === corrAnsLoc");
            } else if (ansSelected == gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ].corrAnsLoc) {
                console.log("ON CLICK ANSWER-SEL: +ansSelected DID == corrAnsLoc");
            } else {
                console.log("ON CLICK ANSWER-SEL: +ansSelected DID NOT === OR == corrAnsLoc");
            };
            console.log("gameObj.currQuestion = " + gameObj.currQuestion + "; S/B 0 to 9 Incrementing");
            console.log("gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ] = " + gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ] );
        };

        // Color the correct answer then 
        $("#button-answer"+ gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ].corrAnsLoc).css("background-color" , "lime");
        // alert("#button-answer"+ gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ].corrAnsLoc);
        $("#button-answer"+ gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ].corrAnsLoc).css("background-color", "lime");
        var delayColorCorrect = setTimeout(function() {
            $("#button-answer"+ gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ].corrAnsLoc).css("background-color", "purple");
        }, 2000);   
        // Compare this button number with the correct answer button number for this question
        if (+ansSelected === gameObj.gameQsObjectsObj[gameObj.gameQListNums[gameObj.currQuestion-1] ].corrAnsLoc ) {
            // Increment appropriate answer count
            gameStats.ansCorrect++;
            $(this).css("background-color", "lime");
                var delayBtnColorCorr= setTimeout(function() {
                    $(this).css("background-color", "purple");
                }, 2000);   
            celebrateCorrAns();
        } else {
            gameStats.ansInCorrect++;
            $(this).css("background-color", "red");
                var delayBtnColorInCorr= setTimeout(function() {
                    $(this).css("background-color", "purple");
                }, 2000);   
            nonCelebrateWrongAns();
        };

        // Check if all 10 questions have been asked...
        if ( gameStats.totalQsCmpl() < gameStats.totalQsToAsk) {
            if (DEBUG) {
                console.log("Let's ASK another one! TotalCmpl = " + gameStats.totalQsCmpl());
              };
              // More to come
            stopwatch.stop();
            stopwatch.reset();
            var delayPostNextQ = setTimeout(function() {
                postQuestion(gameObj.currQuestion); // currQuestion incremented at the end of the function.
                stopwatch.start();
           }, 2000);

    
        } else {
            // Game Over, display final results
            displayFinalResults();
        };
        if (DEBUG) {
            console.log("gameObj.gameQsObjectsObj[jj].presentedAnswers" + gameObj.gameQsObjectsObj[jj].presentedAnswers);
            gameStats.printTotals();
        };

        // unAnswered++;

        // if ( questionsPresented <= 10 ) {
            // continue asking questions 
    // } else {
        // declare game won or lost
        // gamesWon++;
        // gamesLost++
        // ask to play again
    // }
    } );

} ); // End of Document Ready