//  Interval Exercise (follow the instructions below).

//  This code will run as soon as the page loads.
window.onload = function() {

  //  Click events are done for us:
  $("#lap").click(stopwatch.recordLap);
  $("#stop").click(stopwatch.stop);
  $("#reset").click(stopwatch.reset);
  $("#start").click(stopwatch.start);
};

//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

// prevents the clock from being sped up unnecessarily
var clockRunning = false;

//  Our stopwatch object.
var stopwatch = {

  time: 0,
  lap: 1,
  lapsHtml : "",

  reset: function() {

    stopwatch.time = 0;
    stopwatch.lap = 1;

    //  TODO: Change the "display" div to "00:00."
    $('#display').html("00:00");
    stopwatch.lapsHtml = "";
    $('#laps').html(  stopwatch.lapsHtml   );

  },

  start: function() {

    //  TODO: Use setInterval to start the count here and set the clock to running.
    if (!clockRunning) {
      clockRunning = true;
      // This commented line is WRONG... do NOT give the () at the end of the count function
      // intervalId = setInterval(stopwatch.count(), 1000 );
      // This second line works but is wrong accoding to w3 schools...
      // intervalId = setInterval(stopwatch.count, 1000 );
      // THIS SHOULD BE THE FORMAT... setInterval(function(){ alert("Hello"); }, 3000);
      intervalId = setInterval(function() {stopwatch.count() }, 1000 );
    }

  },
  stop: function() {

    //  TODO: Use clearInterval to stop the count here and set the clock to not be running.
    window.clearInterval(intervalId);
    clockRunning = false;

  },

  recordLap: function() {

    //  TODO: Get the current time, pass that into the stopwatch.timeConverter function,
    //        and save the result in a variable.
    var convertedTime = stopwatch.timeConverter(stopwatch.time);

    //  TODO: Add the current lap and time to the "laps" div.
    stopwatch.lapsHtml += "Lap Count = " + stopwatch.lap + " at time: " + convertedTime + "<br>";
    $('#laps').html(  stopwatch.lapsHtml   );

    //  TODO: Increment lap by 1. Remember, we can't use "this" here.
    stopwatch.lap++;
  },

  count: function() {

    //  TODO: increment time by 1, remember we cant use "this" here.
    stopwatch.time++;

    //  TODO: Get the current time, pass that into the stopwatch.timeConverter function,
    //        and save the result in a variable.
    var convertedTime = stopwatch.timeConverter(stopwatch.time);
    //  TODO: Use the variable you just created to show the converted time in the "display" div.
    $('#display').html(convertedTime);
    // console.log("Inside Count!!!");
  },

  //  THIS FUNCTION IS DONE FOR US!
  //  We do not need to touch it.

  timeConverter: function(t) {

    //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes === 0) {
      minutes = "00";
    }

    else if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  }
};
