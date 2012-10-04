define(function(require) {
  var mediator = require("../mediator");

  return Backbone.View.extend({
    template: Handlebars.templates.stumbleFrame,
    loaderTemplate: Handlebars.templates.loader,

    initialize: function() {
      mediator.on("stumble", this.updateStumble, this);
      mediator.on("stumble", this.showLoading, this);
    },

    render: function() {
      var $frame = this.$el.find("#stumble-frame");
      if ($frame.length) {
        $frame.replaceWith(this.template({
          src: "//" + this.model.get("url")
        }));
      } else {
        this.$el.append(this.template({
          src: "//" + this.model.get("url")
        }));
      }
    },

    removeLoader: function() {
      var self = this,
          $spinner;

      $spinner = this.$el.find(".spinner-wrap").addClass("fadeOut");
      setTimeout(function() {
        self.loader.stop();
        self.loader = null;
        $spinner.remove();
      }, 300);
    },

    showLoading: function() {
      if (!this.loader) {
        this.$el.append(this.loaderTemplate());
        this.loader = new Spinner({
          lines: 13,
          length: 18,
          width: 7,
          radius: 24,
          color: "#dedede",
          hwaccel: true
        }).spin(this.$el.find(".spinner-cont").get(0));
      }
    },

    updateStumble: _.debounce(function(stumble) {
      this.model = stumble;
      this.render();
      mediator.trigger("stumble:complete");
      _.delay(this.removeLoader.bind(this), 150);
    }, 350)
  });
});
