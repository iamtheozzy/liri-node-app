require("dotenv").config();


// requires files for app to work
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");

// storing variables for node selectors
var node = process.argv;
var commands = node[2];


// Controls Twitter request from user
if (commands === "my-tweets") {

  // request auth keys
  var client = new Twitter(keys.twitter);

  // Sets what account we are looking into
  var params = {
    screen_name: 'iamtheozzy'
  };

  // Requests
  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      for (var i = 0; i < tweets.length; i++){

        var name = tweets[i].user.screen_name;
        var text = tweets[i].text;
        var time = tweets[i].created_at;

        console.log("@" + name + " - " + time + "\n" + text);
        console.log("----------------------------------------")
      };


    };
  });

};


// Controls spotify request from user
if (commands === "spotify-this-song") {


  var output = "";
  for (var i = 3; i < process.argv.length; i++) {
    output += process.argv[i] + " ";
  };

  // stores song name
  var songTitle = output ? output : "'The Sign' by Ace of Base";

  console.log(output)

  // authenticates spotify api
  var spotify = new Spotify(keys.spotify);

  spotify.search({
    type: 'track',
    query: songTitle
  }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      // stores larger object from Spotify
      var songInfo = data.tracks.items;
      // loops through object
      for (var i = 0; i < songInfo.length; i++) {

        var albumName = songInfo[i].album.name;
        var artistName = songInfo[i].artists[0].name;
        var preview = songInfo[i].preview_url;
        var songName = songInfo[i].name;
        // console.log(songInfo);

        // Prints artist info to the console
        console.log("Song: " + songName);
        console.log("Artist: " + artistName);
        console.log("Album: " + albumName);
        if (preview === null) {
          console.log("Can't find a preview. Perhaps Youtube?");
        } else {
          console.log("Song Preview : " + preview);
        };
        console.log("-----------------------------------------");
      };

    });
};

if (commands === "movie-this") {

  // stores multiple user inputs
  var output = "";
  for (var i = 3; i < process.argv.length; i++) {
    output += process.argv[i] + "+";
  };

  output = output.substring(0, output.length - 1);

  var movieTitle = output ? output : "Mr.Nobody";

  var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      // console.log(JSON.parse(body));
      console.log("Movie Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMBD Rating : " + JSON.parse(body).Ratings[0].Value);
      console.log("Rotten Tomatoes Rating : " + JSON.parse(body).Ratings[1].Value);
      console.log("Country : " + JSON.parse(body).Country);
      console.log("Language : " + JSON.parse(body).Language);
      console.log("Plot : " + JSON.parse(body).Plot);
      console.log("Actors : " + JSON.parse(body).Actors);
    }
  });


};
