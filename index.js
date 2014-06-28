var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var app = express();

var CHANNEL_NAME = 'do_channel';

var PUBNUB = require("pubnub").init({
    publish_key   : "demo",
    subscribe_key : "demo"
});

mongo_db_table = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/test';
mongoose.connect(mongo_db_table);

// Models
var Habit = mongoose.model(
    'Habit', {
        name: String,
    }
);

var HabitDone = mongoose.model(
    'HabitDone', {
        habit: String,
        when: Date,
    }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/public'));

app.post('/add_habit', function(req, res){
    var habit_name = req.param('name');

    // Save habit
    var habit = new Habit({ name: habit_name });
    habit.save(function (err) {
        if (err) {
            console.log('Error storing: ' + habit);
            res.send("Fail!");
        }
        res.send("Sent!");
    });
})

app.post('/', function(req, res){
    var habit_id = req.param('id');
    var message = {'did' : habit_id};
    PUBNUB.publish({
        channel: CHANNEL_NAME,
        message: message,
        callback: function(e) {

            // Save habitdone
            var habit_done = new HabitDone({ habit: habit_id });
            habit_done.save(function (err) {
                if (err) {
                    console.log('Error storing: ' + habit_done);
                }
            });

            // Show counter
            HabitDone.count({'habit': habit_id}, function(err, count) {
                res.send(count);
            });
        },
        error: function(e) {
            res.send("FAIL! Tracking: " + req.param('id'));
        }
    });
});

var PORT = process.env.PORT || 3000;

app.listen(PORT);
