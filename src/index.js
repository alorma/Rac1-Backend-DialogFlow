var express = require('express');
var action = require('./action');
var bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());

app.post("/", function(req, res)  {
  if (!action) {
    console.error("Action is not defined")
  } else {
    action.process(req.body).then(function(response) { 
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.send(response)
    }, function(error) {
      console.log(error)
    })
  }
})

app.listen(process.env.PORT || 8080);;

