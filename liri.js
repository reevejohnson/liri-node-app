// At the top of the liri.js file, add code to read and set any environment variables with the dotenv package:
var Spotify = require('node-spotify-api');

var request = require('request');

var moment = require('moment');
moment().format();

var fs = require('fs'); 

require("dotenv").config();
// Add the code required to import the keys.js file and store it in a variable.
var keys = require('./keys');

// You should then be able to access your keys information like so
var spotify = new Spotify(keys.spotify);

// Make it so liri.js can take in one of the following commands:

// concert-this
if(process.argv[2] === 'concert-this') {
    var nodeArtistArgs = process.argv;

    var artistName = "";

    for (var i = 3; i < nodeArtistArgs.length; i++) {

        if (i > 3 && i < nodeArtistArgs.length) {
        artistName = artistName + "+" + nodeArtistArgs[i];
        }

        else {
            artistName += nodeArtistArgs[i];
        }
    }

    concertThis(artistName);
}

// spotify-this-song
if(process.argv[2] === 'spotify-this-song') {
    var nodeSongArgs = process.argv;

    var songName = "";

    if (nodeSongArgs.length < 4) {
        songName += 'The Sign'
    }

    else {
        for (var i = 3; i < nodeSongArgs.length; i++) {
    
            if (i > 3 && i < nodeSongArgs.length) {
                songName = songName + "+" + nodeSongArgs[i];
            }
        
            else {
                songName += nodeSongArgs[i];
            }
        }
    }

    spotifyThisSong(songName);
}

// movie-this
if(process.argv[2] === 'movie-this') {

    var nodeMovieArgs = process.argv;

    var movieName = "";

    if (nodeMovieArgs.length < 4) {
        movieName += 'Mr Nobody'
    }

    else {
        for (var i = 3; i < nodeMovieArgs.length; i++) {
    
            if (i > 3 && i < nodeMovieArgs.length) {
                movieName = movieName + "+" + nodeMovieArgs[i];
            }
        
            else {
                movieName += nodeMovieArgs[i];
            }
        }
    }

    movieThis(movieName);
}

// do-what-it-says
if(process.argv[2] === 'do-what-it-says') {

    var command = '';
    var searchTerm = '';

    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }

        var dataArr = data.split(",");

        command += dataArr[0];
        searchTerm += dataArr[1];

        if(command === 'concert-this') {
            concertThis(searchTerm);
        } else if(command === 'spotify-this-song') {
            spotifyThisSong(searchTerm);
        } else if(command === 'movie-this') {
            movieThis(searchTerm);
        }
    })
}

function concertThis (argument) {

    var queryUrl = 'https://rest.bandsintown.com/artists/' + argument + '/events?app_id=' + process.env.BANDSINTOWN_KEY;

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            var events = JSON.parse(body);
            for(i = 0; i < events.length; i++) {
                console.log('\n');
                console.log('Name of venue: ' + events[i].venue.name);
                console.log('Location of venue: ' + events[i].venue.city + ', ' + events[i].venue.region);
                var m = moment(events[i].datetime).format('MM/DD/YYYY')
                console.log('Date of event: ' + m);
                console.log('\n')
            }
        } else {
            console.log('Try a different artist.');
        }
    });

}

function spotifyThisSong (argument) {

    spotify.search({ type: 'track', query: argument}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        var firstInformation = data;
        var secondInformation = firstInformation.tracks.items;
        var artist = secondInformation[0].album.artists[0];
        
        console.log('\n');
        console.log(`Artist: ${artist.name}`);
        console.log(`Song Title: ${secondInformation[0].name}`);
        console.log(`Preview link to the song: ${secondInformation[0].external_urls.spotify}`)
        console.log(`Album: ${secondInformation[0].album.name}`);
        console.log('\n')

    });

}

function movieThis (argument) {

    var queryUrl = "http://www.omdbapi.com/?t=" + argument + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log('\n')
            console.log("Title: "+ JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            var ratings = JSON.parse(body).Ratings
            console.log("Rotten Tomatoes Rating: " + ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log('\n')
        } else {
            console.log('Try a different movie.');
        }
    });

}