var http = require("http");
var dispatcher = require('httpdispatcher');
var MongoClient = require('mongodb').MongoClient

var PORT = process.env.PORT || 5000;
var SLACK_VALIDATION_TOKEN = process.env.SLACK_TOKEN;
var MONGO_URL = process.env.MONGODB_URI;

function handleRequest(request, response) {
    try {
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}
var server = http.createServer(handleRequest);
server.listen(PORT, function() {
    // console.log('Server listening on: http://localhost:%s', PORT);
});

function getFormatedDate(timestamp)
{
  var date = new Date(timestamp);
  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;
  return day + '/' + month+'/' + year;
}
dispatcher.onPost('/checkIn', function (req, res) {
  console.log("In Post")
  if(req.params.token === SLACK_VALIDATION_TOKEN) {
    console.log("Validated")
    day = new Date(req.params.timestamp);
    //if(day.getDay() === 4)
    //{
      checkIn = {
        "Date": getFormatedDate(req.params.timestamp),
        "User_Name": req.params.user_name
      };
      MongoClient.connect(MONGO_URL, function(err, db) {
        // db.createCollection("people", {}, function(err, col) {});
        console.log("this is the db\n>: " + db);
        var people = db.collection('people');
        console.log('this is the collection\n'+ collection);
        people.find(checkIn).toArray(function(err, people) {
          if(people.length > 0) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({"text": "You already checked in"}));
          } else {
            people.insert(checkIn, function(err, result) {
              res.writeHead(200, {'Content-Type': 'application/json'});
              return res.end(JSON.stringify({"text": "You've been checked in"}));
            });
          }
        });
      });

    //}
    //else
    //{
      //res.writeHead(200, {'Content-Type': 'application/json'});
      //return res.end(JSON.stringify({"text": "Come back thursday at 6:30 in AP 448B"}));
    //}
  }
})

dispatcher.onGet('/getAtendees', function (req, res) {
  console.log("In Get")
  MongoClient.connect(MONGO_URL, function(err, db) {
    var people = db.collection('people');
    people.find({}).toArray(function(err, ppl) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({"People": ppl}));
    });
  });
})
