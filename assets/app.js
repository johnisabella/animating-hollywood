// This .on("click") function will trigger the AJAX Call
$("#find-movie").on("click", function(event) {

  // event.preventDefault() can be used to prevent an event's default behavior.
  // Here, it prevents the submit button from trying to submit a form when clicked
  event.preventDefault();

  // Here we grab the text from the user input box
  var movie = $("#movie-input").val().trim();

  // Here we construct our URL to be sent to the OMDB API
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    var actors = response.actors
  });

  //remove user input from the movie-input div class to allow users to enter additional movie titles.
  $("#movie-input").empty();

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
