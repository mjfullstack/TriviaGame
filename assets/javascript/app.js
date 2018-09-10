$(document).ready(function(){

    /*******************/
    /****   VARS    ****/
    /*******************/
    var ansCorrect = 0; // Set at beginning of app and at restart
    var ansInCorrect = 0; // Set at beginning of app and at restart
    var unAnswered = 0;
    var gameOver = false;
    var corrAnsButtonNum = 0; // Will be randomized
    var wrongAnsButtonNums = []; // 
    var candyObjArr = []; // An array of objects, pushed on after being generated, access via index for randomness
    var ansLocSelected;  // Count up to 4 or start at 4 and quit when it's zero...

    // Raw data for app
    // &#39; for ' - Apostrophe / Single Quote
    // &#34; for " - Double Quotes
    // Evens starting at 0 are candy names
    // Odds starting at 1 are clues for the preceding candy name.
    var rawCandy = [
	"Twix" , "Which candy claimed to have &#34chocolate, caramel and a surprising cookie crunch&#34?" ,
	"Reese&#39s Peanut Butter Cup" , "Which candy claimed to have &#34two great tastes that taste great together&#34?" ,
	"Heath Bar" , "Which candy had &#34a taste so good, it speaks for itself&#34?" ,
	"Hershey&#39s" , "Which candy was called the “Great American Candy Bar&#34?" ,
	"Snickers" , "Which candy &#34Really Satisfies&#34?" ,
	"Milky Way" , "Which candy claimed &#34You can almost hear it moo&#34?" ,
	"3 Musketeers" , "Which candy claimed that with &#343 big pieces, it&#39s a candy treat that can&#39t be beat&#34?" ,
	"Kit Kat Bar" , "Which candy made you say “Give me  a break&#34?" ,
	"Oh, Henry" , " Which candy claimed “What makes it big, makes it good&#34?" ,
	"M\&M&#39s" , "Which candy claimed that it “Melts in your mouth, not in your hand&#34?" ,
	"Mound&#39s" , "Which candy claimed “Sometimes you feel like a nut, sometimes you don&#39t&#34?" ,
	"Skittles" , "Which candy claimed “Taste the Rainbow&#34?" ,
	"Carmello" , "Which candy claimed you could “Stretch it Out&#34?" ,
	"100 Grand Bar" , "Which candy claimed to be “extra-rich in caramel&#34?" ,
	"Nestle Crunch Bar" , "Which candy asked “Who taught chocolate to talk a lot?&#34?" ,
	"York&#39s Peppermint Pattie" , "Which candy told you to “Get the Sensation&#34?"
    ];

    /*******************/
    /**** FUNCTIONS ****/
    /*******************/
    // Candy Object Constructor
    function  Candy ( name, clueIn, corrLocNum, wrongLocsArr, wrongAnsArr ) {
        this.name          = name;
        this.clue          = clueIn; // 'Long' text string question: "Which candy...""
        this.corrAnsLoc    = corrLocNum; // Will be randomized 0 to 3 for which answer button to populate
        this.wrongAnsLocs  = wrongLocsArr; // Array of 3 values 0 to 3 possible answer locations EXCLUDING corrLocNum
        this.wrongNames    = wrongAnsArr; // Array of 3 strings from Candy.name of 0 to 16 possible candy objects
    } ;

    // Candy Object Methods
    Candy.prototype.printStats = function() {
        console.log("this.name = " + this.name);
        console.log("this.clue = " + this.clue);
        console.log("this.corrAnsLoc = " + this.corrAnsLoc);
        console.log("this.wrongAnsLocs = " + this.wrongAnsLocs);
        console.log("this.wrongNames = " + this.wrongNames);
    };



    // Candy Bar Instantiations
    var numOfRawCandy = 16;
    console.log("numOfRawCandy = " + numOfRawCandy);

    function consumeRawCandy(numOfRawCandyIn) {
        console.log("numOfRawCandyIn = " + numOfRawCandyIn);
        var newObjName = "";
        for ( var i=0; i < 2*numOfRawCandyIn; i=i+2) {
            var newObjNameRaw = rawCandy[i];
            newObjNameRaw = newObjNameRaw.split(" "); //.join(""); //, rawCandy[i] );
            // newObjName = newObjName[0].toLowerCase() + newObjName[1-newObjName.length-1].name;
            newObjNameRaw[0] = newObjNameRaw[0].toLowerCase(); // Better way to make first letter lowercase
            console.log("newObjNameRaw = " + newObjNameRaw); // WORKS
            var concatNewObjName = "";
            for ( ii=0; ii<newObjNameRaw.length; ii++) {
                concatNewObjName += newObjNameRaw[ii];
                newObjName = concatNewObjName;
            };
            console.log("concatNewObjName = " + concatNewObjName + "; newObjName = " + newObjName);
            wrongAnsArr = ["Big", "Bad", "Bear"]
            var newObjName = new Candy( rawCandy[i], rawCandy[i+1], 0, [1, 2, 3], wrongAnsArr);
            console.log("newObjName.name = " + newObjName.name );
            newObjName.printStats();
        };
    };

    // Call my consumeRawCandy function here...
    consumeRawCandy(numOfRawCandy); // This call and the function WORK, 09/09/18
    // corrAnsLoc, randArr0to3, wrongAnsArr["Big", "Bad", "Bear"]);
    // twix.printStats();


    
    // Populate the Objects - via FOR-loops

    // From Snow White for Reference
    // =================================
    // dwarfNum: [],
    // dwarfsFound: 0, // Count of ints found for randomization of DWARFS
    // actNum: [], // Separate random number for randomizing the activity, too
    // actsFound: 0, // Count of ints found for randomization of ACTIVITIES
    // randNum : 0,  // Used for both randomizaions
    // =================================
    // corrAnsLoc:       Single random number 0 to 3 corresponding to the button # for correct answer
    // randArr0to3:       Array of 3 numbers 0 to 3 EXCLUDING the current value of corrAnsLoc
    // wrongNamesNumbArr: 0 to 15, which candyObjArr[item] to get a name from
    // From Snow White for Reference
    // =================================
    // dwarfNum: [],
    // dwarfsFound: 0, // Count of ints found for randomization of DWARFS
    // actNum: [], // Separate random number for randomizing the activity, too
    // actsFound: 0, // Count of ints found for randomization of ACTIVITIES
    // randNum : 0,  // Used for both randomizaions
    // =================================

        // Number of buttons / choices per question
    // var numOfAns = 4; // This may become randomized later, but for now, we're starting with fixed at 4
    
        // Get first number for the button on which to place the correct answer
    // var randNum0to3 = Math.floor(Math.random() * numOfAns); // Correct answer location in 0 to 3
    // var corrAnsLoc = randNum0to3; // Button number of correct answer
    
        // Now we need an array with random numbers 0 to 3, EXCLUDING corrAnsLoc, the one just generated
        // for which button name/number (0 to 3) to place each wrong answer on
    // var wrongAnsLocArr = []; // For 3 values of index 0 to 3 (4 possible index before comparing with correct answer location)
    // var randNum = 0;
        // var wrongAnsObjNumArr = []; // For 16 values of candyObjArr items
    // randNum = Math.floor(Math.random() * this.dwarfName.length);
    // wrongAnsLocArr.push(randNum);
    // ansLocSelected++;

    // while (this.dwarfsFound < this.dwarfName.length) {
    //     this.randNum = Math.floor(Math.random() * numOfAns);
    //     var found = false;
    //     for (i=0; i< this.dwarfNum.length; i++) {
    //         if (this.randNum === this.dwarfNum[i] )
    //             found = true;
    //     };
    //     if (!found) {
    //         this.dwarfNum.push(this.randNum);
    //         this.dwarfsFound++;
    //     };
    // };

    // var wrongAnsObjNumArr = []; // For 3 values of the 16 candyObjArr items indexed 0 to 15
    // var whichCandyObjItemsToAskArr = []; // For 10 values of candyObjArr items
    // var candyQuestionsArr = []; // For the 10 questions for this round of the game

    // Now we need an array of three numbers between 0 and 15 to index into the candyObjArr
    // and select those candy names to become the wrong answer.
    // This selection of 3 must exclude the question item we are presenting (0 to 9)

    // Now we need an array of 10 numbers selected from the values of 0 to 15 to identify
    // the candyObjArr[] items we will use as questions for this game!



    /////////////////////
    // RE-START BUTTON //
    /////////////////////
    $(".button-start-re-start").on("click", function() {
        // Initialize Vars


        // Initialize Attributes / Classes

    } );
} ); // End of Document Ready