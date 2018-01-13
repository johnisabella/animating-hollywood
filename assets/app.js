

      // This .on("click") function will trigger the AJAX Call
      $("#find-movie").on("click", function(event) {

        // event.preventDefault() can be used to prevent an event's default behavior.
        // Here, it prevents the submit button from trying to submit a form when clicked
        event.preventDefault();
        
        // Here we grab the text from the user input box
        var movie = $("#movie-input").val().trim();
        var apiKey = 'ebd97e72';

        // Here we construct our URL to be sent to the OMDB API
        // Long plot query URL
        var queryURL = 'https://www.omdbapi.com/?apikey=' + apiKey + '&t=' + movie;

        // Short plot query- delete later?
        // var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + apiKey;

        $.ajax({
          url: queryURL,
          method: "GET"
        })
        .done(function(response) {
            console.log(response);
          var actors = response.Actors;
          console.log(actors);
          $("#actors-view").text(actors);
        });

    });


    // Giphy API request---------
    // Here we grab the text from the user input box
    // Test value for actor for now
    var actorValue = 'Michael Keaton';
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
        
       
      });