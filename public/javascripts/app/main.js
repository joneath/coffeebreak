$(function() {
  define(function(require) {
    var StumbleRouter = require("routers/stumble_router");

    new StumbleRouter();
    Backbone.history.start({pushState: true});
  });
});
