const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

//initialize Express app
var app = express();

// app.use(bodyParser.urlencoded({extended: false}));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(process.cwd() + "/public"));
//Require set up handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//connecting to MongoDB
//mongoose.connect("mongodb://localhost/scraped_news");
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to Mongoose!");
});

const controller = require('./controller/controller.js')
controller(app)

// var routes = require("./controller/controller.js");
// app.use("/", routes);
//Create localhost port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on PORT " + port);
});
