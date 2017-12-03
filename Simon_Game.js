window.onload = () => {

  var gameOn = false;
  var unPaused = false;
  var strictMode = false;
  var userClicks = [];
  var currentLevel = 1;
  var computerMoves = [];

  //CONSTANTS
  //lighter colors
  const lightGreen = "rgba(198,255,179,0.8)";
  const lightRed = "rgba(255,194,179,0.8)";
  const lightYellow = "rgba(255,255,153,0.8)";
  const lightBlue = "rgba(128,159,255,0.8)";
  //important times
  const buttonTime = 1000;
  const bufferTime = 300;
  const startBuffer = 1300;
  const highestLevel = 20;
  //game messages
  const gameStart = "<p>welcome to the simon game</p>";
  const wrongButton = "<p>Error. Try Again.</p>";
  const restartGame = "<p>Error. Game will restart.</p>";
  const restartLevel = "<p>you must redo this level</p>";
  const userWon = "<p>congratulations! you beat simon.</p>";

  //this array records wait times for each button in session when computer plays.
  var waitTimes = Array(21)
    .fill(startBuffer)
    .map(function(x, index, arr) {
      return x + index * (buttonTime + bufferTime);
    });

  //an array that contains all four functions to play the green,red, yellow and blue buttons.
  var playArray = [
    function() {
      document.getElementById(
        "green-button"
      ).style.backgroundColor = lightGreen;
      document.getElementById("greenAudio").play();
      var timeOutID;
      function waitGreen() {
        timeOutID = setTimeout(function() {
          document.getElementById("green-button").style.backgroundColor =
            "green";
        }, buttonTime);
      }

      waitGreen();
    },
    function() {
      document.getElementById("red-button").style.backgroundColor = lightRed;
      document.getElementById("redAudio").play();
      var timeOutID;
      function waitRed() {
        timeOutID = setTimeout(function() {
          document.getElementById("red-button").style.backgroundColor = "red";
        }, buttonTime);
      }
      waitRed();
    },
    function() {
      document.getElementById(
        "yellow-button"
      ).style.backgroundColor = lightYellow;
      document.getElementById("yellowAudio").play();
      var timeOutID;
      function waitYellow() {
        timeOutID = setTimeout(function() {
          document.getElementById("yellow-button").style.backgroundColor =
            "yellow";
        }, buttonTime);
      }
      waitYellow();
    },
    function() {
      document.getElementById("blue-button").style.backgroundColor = lightBlue;
      document.getElementById("blueAudio").play();
      var timeOutID;
      function waitYellow() {
        timeOutID = setTimeout(function() {
          document.getElementById("blue-button").style.backgroundColor = "blue";
        }, buttonTime);
      }
      waitYellow();
    }
  ];



  //enable all simon buttons allowing user to play game
  function enableAll() {
    document.getElementById("green-button").removeAttribute("disabled");
    document.getElementById("red-button").removeAttribute("disabled");
    document.getElementById("yellow-button").removeAttribute("disabled");
    document.getElementById("blue-button").removeAttribute("disabled");
    document.getElementById("startSwitch").removeAttribute("disabled");
    document.getElementById("onSwitch").removeAttribute("disabled");
    document.getElementById("modeSwitch").removeAttribute("disabled");
  }

  function disableAll() {
    document.getElementById("green-button").setAttribute("disabled", true);
    document.getElementById("red-button").setAttribute("disabled", true);
    document.getElementById("yellow-button").setAttribute("disabled", true);
    document.getElementById("blue-button").setAttribute("disabled", true);
    document.getElementById("startSwitch").setAttribute("disabled", true);
    document.getElementById("onSwitch").setAttribute("disabled", true);
    document.getElementById("modeSwitch").setAttribute("disabled", true);
  }

  function updateCounter() {
    let tenthplace = Math.floor(currentLevel / 10);
    let oneplace = Math.floor(currentLevel % 10);
    document.getElementById("counter").innerHTML =
      "<p>" + tenthplace.toString() + oneplace.toString() + "</p>";
  }


  function backtoWelcome() {
    var timeoutID;
    function wait() {
      timeoutID = setTimeout(function() {
        document.getElementById("msgBox").innerHTML = gameStart;
      }, 1000);
    }
    wait();
  }

  function endGame() {
    var timeoutID;
    function wait() {
      timeoutID = setTimeout(function() {
        location.reload();
      }, 1000);
    }
    wait();
  }

  
  ///event handling function for on and off switch
  document.getElementById("onSwitch").addEventListener("click", function() {
    if (gameOn) {
      document.getElementById("counter").innerHTML = "<p>" + "00" + "</p>";
      document.getElementById("startSwitch").setAttribute("disabled", true);
      //reset computer's moves and user's clicks.
      userClicks = computerMoves = [];
      currentLevel = 0;
    } else {
      document.getElementById("counter").innerHTML = "<p>" + "01" + "</p>";
      document.getElementById("startSwitch").removeAttribute("disabled");
      currentLevel = 1;
      //create all computer's future moves here
      computerMoves = new Array(20).fill(4).map(function(x) {
        return Math.floor(Math.random() * x);
      });
    }

    gameOn = !gameOn;
  });

  //event handling fuction for pause and start switch
  document.getElementById("startSwitch").addEventListener("click", function() {
    if (unPaused) {
      disableAll();
      document.getElementById("startSwitch").removeAttribute("disabled");
      document.getElementById("onSwitch").removeAttribute("disabled");
      document.getElementById("modeSwitch").removeAttribute("disabled");
    } else {
      computerPlays();
    }
    unPaused = !unPaused;
  });

  //event handling function for switching modes
  document.getElementById("modeSwitch").addEventListener("click", function() {
    strictMode = !strictMode;
  });

  //event handling functions for green, red, yellow and blue simon buttons
  document.getElementById("green-button").addEventListener("click", function() {
    playGreen();
    userClicks.push(0);
    if (computerMoves[userClicks.length - 1] === 0) {
      //user presses correct button
      if (userClicks.length === currentLevel) {
        if (currentLevel === highestLevel) {
          //if user won
          document.getElementById("msgBox").innerHTML = userWon;
          endGame();
        } else {
          //if this is the last user move
          userClicks = [];
          currentLevel++;
          updateCounter();
          computerPlays();
        }
      }
    } else {
      if (strictMode) {
        //if computer is in strict Mode
        document.getElementById("msgBox").innerHTML = restartGame;
        backtoWelcome();
        userClicks = [];
        currentLevel = 1;
        updateCounter();
        computerPlays();
      } else {
        //if computer is in normal mode
        document.getElementById("msgBox").innerHTML = wrongButton;
        backtoWelcome();
        userClicks = [];
        computerPlays();
      }
    }
    //computerPlays();
  });

  document.getElementById("red-button").addEventListener("click", function() {
    playRed();
    userClicks.push(1);
    if (computerMoves[userClicks.length - 1] === 1) {
      if (userClicks.length === currentLevel) {
        //if this is the last user move
        if (currentLevel === highestLevel) {
          //if user won
          document.getElementById("msgBox").innerHTML = userWon;
          endGame();
        } else {
          userClicks = [];
          currentLevel++;
          updateCounter();
          computerPlays();
        }
      }
    } else {
      if (strictMode) {
        //if computer is in strict Mode
        document.getElementById("msgBox").innerHTML = restartGame;
        backtoWelcome();
        userClicks = [];
        currentLevel = 1;
        updateCounter();
        computerPlays();
      } else {
        //if computer is in normal mode
        document.getElementById("msgBox").innerHTML = wrongButton;
        backtoWelcome();
        userClicks = [];
        computerPlays();
      }
    }
  });

  document
    .getElementById("yellow-button")
    .addEventListener("click", function() {
      playYellow();
      userClicks.push(2);
      if (computerMoves[userClicks.length - 1] === 2) {
        if (userClicks.length === currentLevel) {
          //if this is the last user move
          if (currentLevel === highestLevel) {
            //if user won
            document.getElementById("msgBox").innerHTML = userWon;
            endGame();
          } else {
            userClicks = [];
            currentLevel++;
            updateCounter();
            computerPlays();
          }
        }
      } else {
        if (strictMode) {
          //if computer is in strict Mode
          document.getElementById("msgBox").innerHTML = restartGame;
          backtoWelcome();
          userClicks = [];
          currentLevel = 1;
          updateCounter();
          computerPlays();
        } else {
          //if computer is in normal mode
          document.getElementById("msgBox").innerHTML = wrongButton;
          backtoWelcome();
          userClicks = [];
          computerPlays();
        }
      }
      //computerPlays();
    });

  document.getElementById("blue-button").addEventListener("click", function() {
    playBlue();
    userClicks.push(3);
    if (computerMoves[userClicks.length - 1] === 3) {
      if (userClicks.length === currentLevel) {
        //if this is the last user move
        if (currentLevel === highestLevel) {
          //if user won
          document.getElementById("msgBox").innerHTML = userWon;
          endGame();
        } else {
          userClicks = [];
          currentLevel++;
          updateCounter();
          computerPlays();
        }
      }
    } else {
      if (strictMode) {
        //if computer is in strict Mode
        document.getElementById("msgBox").innerHTML = restartGame;
        backtoWelcome();
        userClicks = [];
        currentLevel = 1;
        updateCounter();
        computerPlays();
      } else {
        //if computer is in normal mode
        document.getElementById("msgBox").innerHTML = wrongButton;
        backtoWelcome();
        userClicks = [];
        computerPlays();
      }
    }
    //computerPlays();
  });

  function playGreen() {
    playArray[0]();
  }

  function playRed() {
    playArray[1]();
  }

  function playYellow() {
    playArray[2]();
  }

  function playBlue() {
    playArray[3]();
  }

  function computerPlays() {
    //disable all buttons while computer goes through sequence
    disableAll();

    //this block creates a current level size array with green, red, yellow and blue buttons in sequence.
    var functionArray = computerMoves
      .slice(0, currentLevel)
      .map(function(button, index) {
        var timeOutID;
        //var tempFunc = playArray[button];
        return function() {
          timeOutID = setTimeout(playArray[button], waitTimes[index]);
        };
      });

    var timeOutID;
    functionArray.push(function() {
      timeOutID = setTimeout(function() {
        enableAll();
      }, waitTimes[currentLevel]);
    });

    functionArray.callAll();
  }
};
