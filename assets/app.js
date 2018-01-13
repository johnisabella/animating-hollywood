$(document).ready(function() {

//Henry's Work********************
// constructing a URL to search OMDB
var apiKey = 'ebd97e72';
var searchTerm = 'batman';
var queryURL = 'https://www.omdbapi.com/?apikey=' + apiKey + '&t=' + searchTerm;

$.ajax({
    url: queryURL,
    method: "GET"
  })

  // After the data comes back from the API
  .done(function(response) {
    console.log(response);
   // Storing an array of results in the results variable
   var results = response.data;

  });

});