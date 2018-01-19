//basic settings:
var omdbApiKey = 'ebd97e72';
var giphyApiKey = 'dc6zaTOxFJmzC';
var giphyRating = 'g';
$("#find-movie").on("click", function(event) { //when "Search" is clicked, do 4 things:
  event.preventDefault();
  var movie = $("#movie-input").val().trim(); //1. grab user input from search box
  var queryURL = `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${movie}&rating=giphyRating`;
  $.ajax(queryURL).done(function(response) { //2. make the ajax call to omdb
      clearPreviousSearch(); //3. clear search box, clear movie title and actor list from previous search
      displayActorList(response); //4. show new movie title and actor list
  });
});

function displayActorList(jsonFromOMDB) {
  var intro = $("<h3>Starring:</h3>");
  var movieTitle = `<h2>${jsonFromOMDB.Title}, ${jsonFromOMDB.Year}</h2>`;
  $("#movie-title").append(movieTitle, intro);
  var actors = jsonFromOMDB.Actors.split(', ');
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
}
  function clearPreviousSearch() {
    $("#movie-input").empty();
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
