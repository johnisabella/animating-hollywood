//basic settings:
var omdbApiKey = 'ebd97e72';
var giphyApiKey = 'dc6zaTOxFJmzC';
var giphyRating = 'g';

$("#find-movie").on("click", function(event) { //add click event to "Search" button:
  event.preventDefault();
  var movie = $("#movie-input").val().trim();
  var queryURL = `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${movie}&rating=giphyRating`;
  $.ajax(queryURL).done(function(response) { //when "Search" is clicked, do 4 things:
    clearPreviousSearch(); //clear movie title and actor list from previous search
    // displayActorList(); //show new movie title and actor list

    var actors = response.Actors.split(', ');
    $("#movie-input").empty();
    // Create movie title to be display
    var intro = $("<h3>Starring</h3>")
    var movieTitle = '<h2>' + movie + '</h2>';
    $("#movie-title").append(movieTitle, intro);
    // change height of main content container to grow
    $(".main-content").css("height", "auto");
    // Looping through the array of actors from the OMDB API to display in the DOM
    for (var i = 0; i < actors.length; i++) {
      // Then dynamicaly generating buttons for each actor in the array.
      var a = $("<button>");
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
  });
});

function clearPreviousSearch() {
  $('#movie-title').empty();
  $('#actors-view').empty();
}

function giphyCall() {
  $('#actors-view').on('click', '.btn', function(e) {
    e.preventDefault();
    console.log('clicked');
    // get data value for actors name
    var actorValue = $(this).data("name");
    // Giphy API request---------
    // Here we grab the text from the user input box
    console.log(actorValue);
    var giphyApiKey = 'dc6zaTOxFJmzC';
    // Here we construct our URL to be sent to Giphy API
    var giphyQueryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      actorValue + "&api_key=" + giphyApiKey + "&limit=9";
    // Make the request
    $.ajax({
        url: giphyQueryURL,
        method: "GET"
      })
      .done(function(response) {
        console.log(response);
        populateGifs(response);
      });
  });
}
giphyCall();

function populateGifs(jsonFromGiphy) {
  $('#gif-display-area').empty(); //first empty the current gifs on display
  for (var i of jsonFromGiphy.data) {
    var gifUrl = i.images.fixed_height.webp; //I chose webp because it's smaller. If gif is preferred, replace .webp with .url
    var imgDiv = `<img src=${gifUrl}>`;
    $('#gif-display-area').append(imgDiv);
  }
}
