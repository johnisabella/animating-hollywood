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
          $("#actors-view").text(actors);
        });

        // -----------------------------------------------------------------------

      });
