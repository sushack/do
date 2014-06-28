var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/public'));


app.post('/', function(req,res){

	res.send("ok! - " + req.param('id'));

})


var PORT = process.env.PORT || 3000;

app.listen(PORT);