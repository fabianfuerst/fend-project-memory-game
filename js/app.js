/*
 * Create a list that holds all of your cards
 */
var cards = ['fa fa-diamond', 'fa fa-diamond', "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

var start = function(){
  shuffle(cards);
  for(var i = 0; i < cards.length; i++) {
    $('.deck').append('<li class="card notopen"><i class="'+cards[i]+'"</i></li>')
  };
};

start();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// openCard is triggered when a card is clicked. It toggles the class open and show to make the card visible
var openCard = function(element){
  $(element).toggleClass('open show notopen');
};

// The open cards array is used for checking if the open cards are identical and is emptied after the check
var openCards = [];


// adds classes of cards to the open card array
var addOpenCard = function(element){
  openCards.push($(element).children().attr('class'));
};

// triggered when the cards match. Changes the class to match and empties the openCards array
var cardsMatch = function(){
  $('.open').toggleClass('match open show');
  openCards.pop();
  openCards.pop();
};


/* cardsNotMatch is triggered if the two cards don't match. It sets a Timeout to enable the user to see the cards
and turns off the event listener in the meanwhile. */

var cardsNotMatch = function(){
  $('.deck').css("pointer-events", "none");
  $('.open').toggleClass('notmatch');
  setTimeout(function(){
    $('.open').toggleClass('notmatch open show notopen');
    $('.deck').css("pointer-events", "auto");
  }, 1000);
  openCards.pop();
  openCards.pop();
};


// necessary variable to hide stars after a certain moveCount
var stars = 3;


// moveCount counts moves the user makes and hides stars after certain moveCounts
var moveCount = function() {
  var currentValue = parseInt($('.moves').text(),10);
  var newValue = currentValue + 1;
  $('.moves').empty();
  $('.moves').append(newValue);
  if (newValue === 14) {
    $('#star3').toggleClass('fa fa-star fa fa-star-o');
    stars = 2;
  } else if (newValue === 21) {
    $('#star2').toggleClass('fa fa-star fa fa-star-o');
    stars = 1;
  } else if (newValue === 28) {
    $('#star1').toggleClass('fa fa-star fa fa-star-o');
    stars = 0;
  };
};

// Triggered when the game is won. If  winnning message is confirmed, game will be restarted
var winningGame = function() {
  if ($('.match').length === 16) {
    setTimeout(function(){
      if (confirm("You won the game! Your final score is " + stars + " stars and " + $('.moves').text() + " moves! You had " + $('#time').text()+' left.') == true) {
        $('.deck').empty();
        start();
        $('.moves').empty();
        $('.moves').append(0);
        if($('#star3').attr('class')==='fa fa-star-o') {
          $('#star3').toggleClass('fa fa-star fa fa-star-o');
        }
        if($('#star2').attr('class')==='fa fa-star-o') {
          $('#star2').toggleClass('fa fa-star fa fa-star-o');
        }
        if($('#star1').attr('class')==='fa fa-star-o') {
          $('#star1').toggleClass('fa fa-star fa fa-star-o');
        }
      }
    }, 1000);
  };
};

// Event listener for click events on cards
 $('.deck').on('click', '.notopen', function(event){
   openCard(this);
   addOpenCard(this);
   if (openCards.length > 1) {
     if (openCards[0] === openCards[1]){
       cardsMatch();
       moveCount();
       winningGame();
     } else {
       cardsNotMatch();
       moveCount();
     };
   };
 });

// Event listener for restart button - restarts the game if clicked
 $('.restart').on('click',function(){
   $('.deck').empty();
   start();
   $('.moves').empty();
   $('.moves').append(0);
   if($('#star3').attr('class')==='fa fa-star-o') {
     $('#star3').toggleClass('fa fa-star fa fa-star-o');
   }
   if($('#star2').attr('class')==='fa fa-star-o') {
     $('#star2').toggleClass('fa fa-star fa fa-star-o');
   }
   if($('#star1').attr('class')==='fa fa-star-o') {
     $('#star1').toggleClass('fa fa-star fa fa-star-o');
   }
 });

 /* Timer reset functionality
 function Timer(fn, t) {
     var timerObj = setInterval(fn, t);

     this.stop = function(){
       if(timerObj) {
         clearInterval(timerObj);
         timerObj = null;
       }
     }

     //start Timer using current settings (if it's not already running)
     this.start = function() {
       if(!timerObj){
         this.stop();
         timerObj = setInterval(fn, t);
       }
       return this;
     }

     //start with new interval, stop current interval
     this.reset = function(newT) {
       t = newT;
       return this.stop().start();
     }
*/

 // Timer used from: https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
   function startTimer(duration, display) {
      var timer = duration, minutes, seconds;
      setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.text(minutes + ":" + seconds);

          if (--timer < 0) {
              timer = duration;
          }
      }, 1000);
  };

$(function ($) {
    var fiveMinutes = 60 * 5,
        display = $('#time');
    startTimer(fiveMinutes, display);
});
