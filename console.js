var pubnub = require("pubnub").init({
    publish_key   : "demo",
    subscribe_key : "demo"
});

pubnub.subscribe({
    channel  : "do_channel",
    callback : function(message) {
        console.log( " > ", message );
    }
});

