var http = require("http");
var dispatcher = require('httpdispatcher');
var os = require('os');
var time = require('time');
var PORT = process.env.port || 5000;
var SLACK_VALIDATION_TOKEN = 'vKzzyX96y3iZdTUMJFBeV7sh'
function handleRequest(request, response){
    try {
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}
var server = http.createServer(handleRequest);
server.listen(PORT, function(){
    // console.log('Server listening on: http://localhost:%s', PORT);
});

dispatcher.onPost('/checkIn', function (req, res)
{
  if(req.params.token === SLACK_VALIDATION_TOKEN)
  {
    day = new Date(req.params.timestamp);
    if(day.getDay() === 4)
    {
      checkIn = {
        "TimeStamp": req.params.timestamp,
        "User_Name": req.params.user_name
      };
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({"text": "You've been checked in"}));
    }
    else
    {
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify({"text": "Come back thursday at 6:30 in AP 448B"}));
    }
  }
})

dispatcher.onGet('/getAtendees', function (req, res)
{
  res.writeHead(200, {'Content-Type': 'application/json'});
  return res.end(JSON.stringify({"text": :'Hello'}));
})
