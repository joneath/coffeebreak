define(function(require) {
  var mediator = require("../mediator"),
      LEFT = 37,
      RIGHT = 39;

  return Backbone.View.extend({
    previewShown: true,
    itemWidth: 426,
    itemOffset: 0,
    lastItemLeft: 85,
    currentActive: 0,
    currentPointed: 0,
    template: Handlebars.templates.previewUrls,

    events: {
      "click .preview-url": "previewClick"
    },

    initialize: function() {
      this.render();
      this.setPreviewPositions();
      this.updateContainerSize();

      this.$stalkers = $(".preview-context").stalky({
        container: $(".preview-url"),
        offsetTop: 20
      });

      // Setup stalky
      this.updatePreviewState();
      $(window).trigger("scroll");

      $(window).on("keyup", this.keypress.bind(this));
      $(window).on("mousewheel", this.pageScroll.bind(this));
      $(window).on("resize", _.debounce(this.updatePreviewState.bind(this), 200));
      this.$el.parent().on("mousewheel", this.previewScroll.bind(this));
      mediator.on("stumble:complete", this.triggerScroll, this);
      mediator.on("stumble:next", this.next, this);
    },

    render: function() {
      var json = this.collection.map(function(model) {
        return _.extend({
          cid: model.cid
        }, model.toJSON());
      });

      this.$el.append(this.template({
        urls: json
      }));
    },

    triggerScroll: function() {
      this.$stalkers.clearStalkers();
      $(window).trigger("scroll");
    },

    stumble: function(index) {
      var model = this.collection.at(index);

      if (index > this.collection.length - 1) {
        model = this.collection.last();
        index = this.collection.length - 1;
      } else if (index < 0) {
        model = this.collection.first();
        index = 0;
      }

      if (model && index !== this.currentActive) {
        this.$stalkers.fixAtCurrent();
        this.currentActive = index;
        this.currentPointed = index;

        mediator.trigger("navigate", "/stumble/" + model.cid + "/" + model.get("url"), {
          trigger: true
        });
      }
    },

    showPreview: function() {
      if (!this.previewShown) {
        this.previewShown = true;
        $("body").addClass("preview-shown");
        $("html, body").animate({ scrollTop: 0 }, 300);
        mediator.trigger("preview:shown");
      }
    },

    hidePreview: function() {
      if (this.previewShown) {
        this.previewShown = false;
        $("body").removeClass("preview-shown");
        $("html, body").animate({ scrollTop: 388 }, 300);
        mediator.trigger("preview:hidden");
      }
    },

    previewClick: function(e) {
      this.stumble($(e.currentTarget).index());
    },

    previewScroll: function(e, delta, deltaX, deltaY) {
      e.preventDefault();
      e.stopPropagation();

      this.handleScroll(deltaX, deltaY);
    },

    pageScroll: _.debounce(function(e, delta, deltaX, deltaY) {
      if (deltaX == 0 && deltaY != 0 && deltaY > 3.0) {
        this.showPreview();
      } else if (e.target.className === "stumble-frame-layer" && deltaY < 0) {
        this.hidePreview();
      }
    }, 200, true),

    handleScroll: function(deltaX, deltaY) {
      // Left / Right
      if (deltaY == 0) {
        if (deltaX < 0) {
          // Left
          this.pageLeft();
          return;
        } else if (deltaX > 0) {
          // Right
          this.pageRight();
          return;
        }
      }

      if (deltaX == 0) {
        // Up / Down
        if (deltaY > 0) {
          // Up
          this.showPreview();
          return;
        } else if (deltaY < 0) {
          // Down
          this.hidePreview();
          return;
        }
      }
    },

    keypress: function(e) {
      if (e.which === LEFT) {
        this.previous();
      } else if (e.which === RIGHT) {
        this.next();
      }
    },

    pageLeft: _.debounce(function() {
      var itemsPerPAge = Math.floor($(window).width() / this.itemWidth);

      this.updatePreviewPosition(this.currentPointed - itemsPerPAge);
    }, 100, true),

    pageRight: _.debounce(function() {
      var itemsPerPAge = Math.floor($(window).width() / this.itemWidth);

      this.updatePreviewPosition(this.currentPointed + itemsPerPAge);
    }, 100, true),

    next: function() {
      this.stumble(this.currentPointed + 1);
    },

    previous: function() {
      this.stumble(this.currentPointed - 1);
    },

    updateControls: function(model) {
      this.$el.find(".preview-controls").addClass("hidden");
      this.$el.find(".preview-url[data-cid='" + model.cid + "'] .preview-controls").removeClass("hidden");
    },

    updateContainerSize: function() {
      var navOffset = 75,
          newWidth = this.collection.length * this.itemWidth + navOffset,
          widowWidth = $(window).width();

      if (newWidth < widowWidth) {
        newWidth = widowWidth;
      }

      this.$el.css({
        width: newWidth
      });
    },

    updatePreviewState: function() {
      if ($(window).scrollTop() > 0) {
        this.previewShown = true;
        this.$stalkers.floatStalkers();
        this.hidePreview();
      } else {
        this.previewShown = false;
        this.showPreview();
      }
    },

    updatePreviewPosition: function(index) {
      if (index > this.collection.length - 1) {
        index = this.collection.length - 1;
      } else if (index < 0) {
        index = 0;
      }
      this.updateControls(this.collection.at(index));

      this.currentPointed = index;
      this.$el.css({
        left: -(this.itemWidth * index)
      });
    },

    setPreviewPositions: function(index) {
      var self = this,
          $preview;

      this.$el.find(".preview-url").each(function() {
        $preview = $(this);
        $preview.css({
          "position": "absolute",
          "left": self.lastItemLeft + self.itemOffset,
          "top": self.itemOffset
        });
        self.lastItemLeft += self.itemWidth;
      }).removeClass("invisible");
    }
  });
});
