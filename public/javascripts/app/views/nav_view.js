define(function(require) {
  var mediator = require("../mediator");

  return Backbone.View.extend({
    events: {
      "click #stumble-bottom": "stumble"
    },

    initialize: function() {
      this.$stalkers = $(".stumble-nav-simple").stalky({
        container: $(".stumble-nav"),
        stickY: 10
      });
    },

    stumble: function(e) {
      mediator.trigger("stumble:next");
    }
  });
});
