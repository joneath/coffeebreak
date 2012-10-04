define(function(require) {
  var StumbleView = require("../views/stumble_view"),
      StumblePreviewView = require("../views/stumble_preview_view"),
      NavViwe = require("../views/nav_view"),
      stumbles = require("../stumbles"),
      mediator = require("../mediator"),
      stumbleCollection;

  return Backbone.Router.extend({
    routes: {
      "": "beginSession",
      "stumble/:cid/*url": "stumble"
    },

    initialize: function() {
      this.stumbleCollection = new Backbone.Collection(stumbles);

      this.stumbleView = new StumbleView({
        el: "#stumble-content",
        collection: this.stumbleCollection
      });

      this.stumblePreviewView = new StumblePreviewView({
        el: "#stumble-preview",
        collection: this.stumbleCollection
      });

      this.navView = new NavViwe({
        el: "#stumble-nav"
      });

      mediator.on("navigate", this.navigate, this);
    },

    beginSession: function() {
      var model = this.stumbleCollection.first();

      this.navigate("/stumble/" + model.cid + "/" + model.get("url"), {
        trigger: true
      });
    },

    stumble: function(cid, url) {
      var model = this.stumbleCollection.getByCid(cid),
          index = this.stumbleCollection.indexOf(model);

      this.stumblePreviewView.updatePreviewPosition(index);
      mediator.trigger("stumble", model);
    }
  });
});
