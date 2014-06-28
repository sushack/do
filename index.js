var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var app = express();

var CHANNEL_NAME = 'do_channel';

var PUBNUB = require("pubnub").init({
    publish_key   : "demo",
    subscribe_key : "demo"
});

mongo_db_table = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/test';
mongoose.connect(mongo_db_table);

// Models
var habit_schema = Schema({
    name: String
});

var habit_done_schema = Schema({
    habit: { type: Schema.Types.ObjectId, ref: 'Habit' },
    when: Date
});

var Habit  = mongoose.model('Habit', habit_schema);
var HabitDone = mongoose.model('HabitDone', habit_done_schema);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/public'));

app.get('/habits', function(req, res) {
    var query = Habit.find().select('id_ name');

    query.exec(function (error, habits) {
        if (error) return handleError(error);
        res.send(habits);
    })
});

app.get('/habits/:id', function(req, res) {
    var habit_id = req.param('id');

    HabitDone.count({'habit': habit_id }, function(error, count) {
        res.send({count:count});
    });
});

app.post('/add_habit', function(req, res){
    var habit_name = req.param('name');
    var habit = new Habit({ name: habit_name });

    habit.save(function (error) {
        if (error) {
            console.log('Error storing (Habit): ' + habit);
            console.log(error);
            res.send("Fail!");
        }
        res.send("Sent!");
    });
});

app.post('/remove_habit', function(req, res){
    var habit_id = req.param('id');

    console.log(habit_id);
    Habit.findByIdAndRemove(habit_id, function(error) {
        if (error) {
            console.log('Error removing (Habit): ' + habit_id);
            console.log(error);
            res.send("Fail!");
        }
        else {
            res.send("Removed!");
        }
    })
});


app.post('/', function(req, res){
    var habit_id = req.param('id');

    var message = {'did' : habit_id};
    PUBNUB.publish({
        channel: CHANNEL_NAME,
        message: message,
        callback: function(e) {

            // Save habitdone
            var habit_done = new HabitDone({ habit: habit_id });
            habit_done.save(function (error) {
                if (error) {
                    console.log('Error storing (HabitDone): ' + habit_done);
                    console.log(error);
                }
            });
        },
        error: function(e) {
            res.send("FAIL! Tracking: " + req.param('id'));
        }
    });
});

var PORT = process.env.PORT || 3000;

app.listen(PORT);

// React stuff

var react = require('react-tools'),
    fs = require('fs');

app.get('/do.js', function(req,res){

    fs.readFile('public/do.jsx', function(error, contents){

        if(error) return res.send('console.log("problem reading file)"');

        var output;
        try{
            output = react.transform(contents.toString());
        } catch(e){
            output = 'console.error("JSX Error - ' + e.toString() + '")';
        }
        res.send(output);

    })
});

