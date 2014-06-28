var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var CHANNEL_NAME = 'do_channel';

var PUBNUB = require("pubnub").init({
    publish_key   : "demo",
    subscribe_key : "demo"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/public'));

app.post('/', function(req, res){
    var message = {'did' : req.param('id')};
    PUBNUB.publish({
        channel: CHANNEL_NAME,
        message: message,
        callback: function(e) {
            res.send("OK! Tracking: " + req.param('id'));
            console.log( "SUCCESS!", e );
        },
        error: function(e) {
            res.send("FAIL! Tracking: " + req.param('id'));
            console.log( "FAILED! RETRY PUBLISH!", e );
        }
    });
});

var PORT = process.env.PORT || 3000;

app.listen(PORT);
