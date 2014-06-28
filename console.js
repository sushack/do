var CHANNEL_NAME = 'do_channel';

var PUBNUB = require("pubnub").init({
    publish_key   : "demo",
    subscribe_key : "demo"
});

pubnub.subscribe({
    channel  : CHANNEL_NAME,
    callback : function(message) {
        console.log( " > ", message );
    }
});

