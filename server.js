
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");// Require axios and cheerio. This makes the scraping possible
var mongoose = require("mongoose"); //Mongo object modelling 

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://user1:password1@ds337418.mlab.com:37418/heroku_5sw4zc0q";

mongoose.connect(MONGODB_URI);


// Start the server
app.listen(PORT, function () {
    console.log(`This application is running on port: ${PORT 3000}`);
});