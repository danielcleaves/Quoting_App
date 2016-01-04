// Require the Express Module
var express = require("express");
// Create an Express App
var app = express();
// Require body-parser (to recieve post data from clients)
var bodyParser = require("body-parser");
// Integrate body-parser with our App
var path = require('path');

app.use(express.static(path.join(__dirname, "./static")));

app.use(bodyParser.urlencoded());
// Setting our Static Folder Directory

// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quoting_db');

var QuoteSchema = new mongoose.Schema({
 name: String,
 quote: String,
 created_at: {type: Date, default: Date.now},
 updated_at: {type: Date}
})

mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote'); // We are retrieving this Schema from our Models, named 'User'



app.get('/', function(req, res) {
    // This is where we will render our home page
    res.render('index');
})

app.get('/quotes', function(req, res) {
    // This is where we will retrieve the quotes and pass them to the main page.
    Quote.find({}, function(err, quotes) {
      if(quotes){
        res.render('quotes',{thequotes:quotes});

      }
      else if(err){
        res.render('quotes',{thequotes:err});
      }

      else {
        res.render('quotes',{thequotes:'no quotes saved yet'})
      }

    })
  })
    


// Add User Request 
app.post('/quotes', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var quote = new Quote({name: req.body.name, quote: req.body.quote});
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  quote.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong',err);
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added quote to database!');
      res.redirect('/quotes')
    }
  })
})


// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})


