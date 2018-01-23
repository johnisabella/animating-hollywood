

function copyText(text) {
  var $input = $("<input>");
  $("body").append($input);
  $input.val(text).select();
  document.execCommand("copy");
  $input.remove();
}

function toClipboard(someText) {
  var temp = document.createElement('input');
  document.body.appendChild(temp);
  temp.value = someText;
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
  console.log('"' + someText + '" should have been copied to your clipboard');
}

//settings:
var omdbApiKey = 'ebd97e72';
var giphyApiKey = 'dc6zaTOxFJmzC';
var giphyRating = 'g'; //what rating gifs do you want to see
var giphyDisplayCount = 12; //how many gifs are shown each time
var movieTitle = "";

//initialize:
initializeFirebase();
$("#find-movie").on("click", omdbCall); //make the omdb call when user clicks "search"
$('#actors-view').on('click', '.btn', giphyCall); //make the giphy call when user clicks an actor name
$('#gif-display-area').on('click', '.heart', toggleFavorite); //toggle favorite on and off when user clicks the heart
$('#gif-display-area').on('click', '.clip', function () {
  toClipboard('Hello World');
})
if (location.pathname.includes('local')) { //if this is the local fav page, show local favs
  showLocalFavs();
} else if (location.pathname.includes('global')) { //if this is the global fav page, show global favs
  showGlobalFavs();
}
/*
no functions above↑
nothing but functions below↓
*/
function omdbCall(event) {
  event.preventDefault();
  clearPreviousSearch(); //clear search box, movie title, actor list, and gif's from last search
  var movie = $("#movie-input").val().trim(); //grab user input from search box
  var queryURL = `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${movie}`;
  $.ajax(queryURL).done(function(response) {
    displayActorList(response); //show new movie title and actor list
  });
}

function giphyCall() {
  // get data value for actors name
  var actorName = $(this).data("name");
  var giphyQueryURL = `https://api.giphy.com/v1/gifs/search?q=${actorName} ${movieTitle}&api_key=${giphyApiKey}&limit=${giphyDisplayCount}&rating=${giphyRating}`;
  $.ajax(giphyQueryURL).done(function(response) {
    populateGifs(response);
  });
}

function displayActorList(jsonFromOMDB) { //this function puts up the movie title and actor list
  //display "No results" message for any user input not found in omdb
  console.log(jsonFromOMDB);
  var noResults = $("<h3>Your search returned no results. Please try again.<h3>")
  if (jsonFromOMDB.Error == "Movie not found!") {
    $("#movie-title").append(noResults);
  } else {
  //display movie title and movie year
  movieTitle = jsonFromOMDB.Title;
  var movie = `<h2>${movieTitle}, ${jsonFromOMDB.Year}</h2>`;
  $("#movie-title").append(movie);
  //display starring:
  var starring = $("<h3>Starring:</h3>");
  $("#movie-title").append(starring);
  // change height of main content container to grow
  $(".main-content").css("height", "auto");
  //  add and remove class in instructions
  $(".step-two").addClass("show");
  $(".step-one").removeClass("show");
  $(".step-three").removeClass("show");
  //display actors
  var actors = jsonFromOMDB.Actors.split(', ');
  for (var i = 0; i < actors.length; i++) {
    // Then dynamically generating buttons for each actor in the array.
    var a = $("<p>");
    // Adding a class
    a.addClass("btn btn-info");
    a.addClass("btnStyle");
    // Adding a data-attribute with a value of the actor at index i
    a.attr("data-name", actors[i]);
    // Providing the button's text with a value of the actors at index i
    a.text(actors[i]);
    // Adding the button to the HTML
    $("#actors-view").append(a);
    }
  }
}

function clearPreviousSearch() { //this function clears the search box, movie title, actor list, and gif's from previous search
  $("#movie-input").empty();
  $('#movie-title').empty();
  $('#actors-view').empty();
  $('#gif-display-area').empty();
}

function populateGifs(jsonFromGiphy) { //this function puts up gifs from giphy search

  $('#gif-display-area').empty(); //first empty the gifs from last clicked actor, if any
  //  add and remove class in instructions
  $(".step-three").addClass("show");
  $(".step-two").removeClass("show");
  //loop through the giphy response, and append each gif
  for (var i of jsonFromGiphy.data) {
    var gifUrl = i.images.fixed_height.url;
    $('#gif-display-area').append(constructGifDiv(gifUrl));
  }
}



function constructGifDiv(gifUrl) { //this function turns a url into a div, something like <div><img src=url><span>❤</span></div>
  var gifDiv = $('<div>'); //create empty div, then append a gif, then append a heart
  gifDiv.append(`<img src=${gifUrl}>`);
  // construct the heart, something like <span class="heart favorite" data-url="xxxxx">❤</span>
  var heart = $('<span>').append('<i class="fa fa-heart" aria-hidden="true"></i>').attr({
    'class': 'heart',
    'data-url': gifUrl
  });
  //check if it's already a favorite, if yes make it red
  if (isFavorite(gifUrl)) {
    heart.toggleClass('favorite', true);
  }
  gifDiv.append(heart);
  var clip = $('<span>').append('<i class="fa fa-clipboard" aria-hidden="true"></i>').attr({'class': 'clip', 'data-url': gifUrl, 'id': 'copy-button', 'data-clipboard-action': 'cut', 'data-clipboard-target': gifUrl});
  gifDiv.append(clip);
  return gifDiv;

}

function isFavorite(url) { //this function checks whether a url is already stored as favorite in localStorage
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (localStorage[key] == url) {
      return true;
    }
  }
  return false;
}

function toggleFavorite() { //this function toggles the heart between white and red, and updates local and global favorites accordingly
  $(this).toggleClass('favorite');
  gifUrl = $(this).attr('data-url');
  if ($(this).hasClass('favorite')) {
    addToBothStorage(gifUrl); //store the url into both local and global favorite
  } else {
    removeFromLocalStorage(gifUrl); //remove from local favorite
    //doesn't remove from firebase, because 1. you shouldn't be able to remove other's favorites 2. let's makes the global favorite more prosperous
  }
}

function addToBothStorage(url) { //this function stores a key and value pair to both localStorage and firebase
  var keyName = url.slice(35, 40); //slice a small part of the file name to be the key name
  localStorage.setItem(keyName, url);
  firebase.database().ref('globalFavorites').child(keyName).set(url);
}

function removeFromLocalStorage(url) { //this function removes a url from localStorage, if it existed
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (localStorage[key] == url) {
      localStorage.removeItem(key);
    }
  }
}

function showLocalFavs() { //this function puts up all gifs stored in localStorage
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (localStorage[key].includes('giphy.com')) { //loop through localStorage, if anything matches a giphy url, display it.
      var gifUrl = localStorage[key];
      $('#gif-display-area').append(constructGifDiv(gifUrl));
    }
  }
}

function showGlobalFavs() { //this function puts up all gifs stored in firebase
  firebase.database().ref('globalFavorites').once('value', function(snapshot) {
    for (i in snapshot.val()) { //loop through firebase and append each one
      $('#gif-display-area').append(constructGifDiv(snapshot.val()[i]));
    }
    $('.heart').addClass('global-favorite'); // this class will make the heart yellow, but red will overwrite yellow is css
  });
  console.log('did it?')
}

function initializeFirebase() {
  var apiKey1stHalf = 'AIzaSyDYUWm29Yot3k';
  var apiKey2ndHalf = 'qEtrpjDY0w8n-NahSBKTU';
  var config = {
    apiKey: apiKey1stHalf + apiKey2ndHalf,
    authDomain: "animating-hollywood.firebaseapp.com",
    databaseURL: "https://animating-hollywood.firebaseio.com",
    projectId: "animating-hollywood",
    storageBucket: "",
    messagingSenderId: "309990232914"
  };
  firebase.initializeApp(config);
}

