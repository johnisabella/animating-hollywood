//settings:
var omdbApiKey = 'ebd97e72';
var giphyApiKey = 'dc6zaTOxFJmzC';
var giphyRating = 'g';
var giphyDisplayCount = 9;

//logic:
$("#find-movie").on("click", omdbCall); //make the omdb call when user clicks "search"
$('#actors-view').on('click', '.btn', giphyCall); //make the giphy call when user clicks an actor name

/*
no functions above↑
nothing but functions below↓
*/

function omdbCall(event) {
  event.preventDefault();
  clearPreviousSearch(); //clear search box, clear movie title and actor list from previous search
  var movie = $("#movie-input").val().trim(); //grab user input from search box
  var queryURL = `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${movie}&rating=giphyRating`;
  $.ajax(queryURL).done(function(response) {
    displayActorList(response); //show new movie title and actor list
  });
}

function giphyCall() {
  // get data value for actors name
  var actorValue = $(this).data("name");
  var giphyQueryURL = "https://api.giphy.com/v1/gifs/search?q=" + actorValue + "&api_key=" + giphyApiKey + "&limit=" + giphyDisplayCount;
  $.ajax(giphyQueryURL).done(function(response) {
    populateGifs(response);
  });
}

function displayActorList(jsonFromOMDB) { //this function puts up the movie title and actor list
  //display movie title and movie year
  var intro = $("<h3>Starring:</h3>");
  var movieTitle = `<h2>${jsonFromOMDB.Title}, ${jsonFromOMDB.Year}</h2>`;
  $("#movie-title").append(movieTitle, intro);
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
}

function populateGifs(jsonFromGiphy) { //this function puts up gifs
  $('#gif-display-area').empty(); //first empty the current gifs on display
  for (var i of jsonFromGiphy.data) {
    var gifUrl = i.images.fixed_height.webp; //I chose webp because it's smaller. If gif is preferred, replace .webp with .url
    var imgDiv = `<img src=${gifUrl}>`;
    $('#gif-display-area').append(imgDiv);
  }
}
