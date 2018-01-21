//settings:
var omdbApiKey = 'ebd97e72';
var giphyApiKey = 'dc6zaTOxFJmzC';
var giphyRating = 'g';
var giphyDisplayCount = 12;
var movieTitle = "";
//logic:
$("#find-movie").on("click", omdbCall); //make the omdb call when user clicks "search"
$('#actors-view').on('click', '.btn', giphyCall); //make the giphy call when user clicks an actor name
$('#gif-display-area').on('click', '.heart', toggleFavorite); //toggle favorite on and off when user clicks the heart
if (location.pathname.includes('local')) { //if this is the local fav page, show local favs
  showLocalFavs()
} else if (location.pathname.includes('global')) { //if this is the global fav page, show global favs
  showGlobalFavs()
}
/*
no functions above↑
nothing but functions below↓
*/
function omdbCall(event) {
  event.preventDefault();
  clearPreviousSearch(); //clear search box, clear movie title and actor list from previous search
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
  //display actors
  var actors = jsonFromOMDB.Actors.split(', ');
  for (var i = 0; i < actors.length; i++) {
    // Then dynamicaly generating buttons for each actor in the array.
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

function clearPreviousSearch() { //this function clears the search box, and clears movie title and actor list from previous search
  $("#movie-input").empty();
  $('#movie-title').empty();
  $('#actors-view').empty();
  $('#gif-display-area').empty();
}

function populateGifs(jsonFromGiphy) { //this function puts up gifs
  $('#gif-display-area').empty(); //first empty the current gifs on display
  //  add and remove class in instructions
  $(".step-three").addClass("show");
  $(".step-two").removeClass("show");
  //loop through the giphy return, and append each gif
  for (var i of jsonFromGiphy.data) {
    var gifUrl = i.images.fixed_height.url;
    $('#gif-display-area').append(constructGifDiv(gifUrl));
  }
}

function constructGifDiv(gifUrl) { //this function turns a url into a div, something like <div><img src=url><span>❤</span></div>
  var gifDiv = $('<div>'); //create empty div, then append a gif, then append a heart
  gifDiv.append(`<img src=${gifUrl}>`);
  // construct the heart, something like <span class="heart favorite" data-url="xxxxx">❤</span>
  var heart = $('<span>').append('❤').attr({
    'class': 'heart',
    'data-url': gifUrl
  });
  //check if it's already a favorite, if yes make it red
  if (isFavorite(gifUrl)) {
    heart.toggleClass('favorite', true);
  }
  gifDiv.append(heart);
  return gifDiv;
}

function isFavorite(url) { //this function checks whether a url is already stored in lockStorage
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (localStorage[key] == url) {
      return true;
    }
  }
  return false;
}

function toggleFavorite() {
  $(this).toggleClass('favorite');
  if ($(this).hasClass('favorite')) {
    addToLocalStorage($(this).attr('data-url'));
  } else {
    removeFromLocalStorage($(this).attr('data-url'));
  }
}

function addToLocalStorage(url) {
  var keyName = url.slice(35, 40); //slice a small part of the file name to be the key name
  localStorage.setItem(keyName, url);
}

function removeFromLocalStorage(url) {
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

function showGlobalFavs() {
  // body...
}
