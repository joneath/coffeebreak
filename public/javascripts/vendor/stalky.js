// Created by Jonathan Eatherly, (https://github.com/joneath)
// MIT license
// Version 0.1

(function($) {
    // Publics
    var exports = {
        updateStalky: function() {
            var self = this;

            this.stalkPoints = [];
            this.currentStalkers = null;

            this.each(function() {
                self.stalkPoints.push({
                    $el: $(this),
                    top: $(this).offset().top,
                    left: $(this).position().left,
                    height: $(this).outerHeight()
                });
            });
        },

        clearStalkers: function() {
            this.currentStalkers = null;
        },

        fixAtCurrent: function() {
            var fixTop = 0,
                scrollTop;

            if (this.currentStalkers) {
                scrollTop = $(window).scrollTop();
                if (scrollTop) {
                    fixTop = scrollTop - this.stalkyOptions.offsetTop;
                }
                $.each(this.currentStalkers, function(i, stalker){
                    stalker.$el.css({
                        position: "absolute",
                        top: fixTop,
                        left: 0,
                        bottom: "auto",
                        right: "auto"
                    });
                });
            }
        },

        floatStalkers: function() {
            var self = this;
            this.currentStalkers = [];
            $.each(this.stalkPoints, function(i, stalker) {
                self.currentStalkers.push(stalker);

                // Position new stalker
                stalker.$el.css({
                    position: "fixed",
                    top: self.stalkyOptions.stickY,
                    left: stalker.$el.offset().left + self.stalkyOptions.stickX,
                    bottom: "auto",
                    right: "auto"
                });
            });
        },

        fixStalkersTop: function() {
            $.each(this.currentStalkers, function(i, stalker){
                stalker.$el.css({
                    position: "absolute",
                    top: 0,
                    right: "auto",
                    left: stalker.left,
                    bottom: "auto"
                });
            });
            this.currentStalkers = null;
            this.stalkyOptions.onFixTop();
        },

        fixStalkersBottom: function() {
            $.each(this.currentStalkers, function(i, stalker){
                stalker.$el.css({
                    position: "absolute",
                    bottom: 0,
                    left: stalker.left,
                    top: "auto"
                });
            });
            this.currentStalkers = null;
            this.stalkyOptions.onFixBottom();
        }
    };

    $.fn.stalky = function(options) {
        this.stalkyOptions = $.extend({
            container: $(window),
            onFixBottom: function() {},
            onMiddle: function() {},
            onFixTop: function() {},
            offsetTop: 0,
            stickY: 0,
            stickX: 0
        }, options);

        for (var key in exports) {
            this[key] = exports[key].bind(this);
        }
        this.containerTop = this.stalkyOptions.container.offset().top;
        this.containerBottom = this.containerTop + this.stalkyOptions.container.height();

        this.updateStalky();

        $(window).on("scroll", watchScroll.bind(this));

        return this;
    };

    function watchScroll(e) {
        var scrollY = $(window).scrollTop(),
            stalkPoint = this.stalkPoints.length ? this.stalkPoints[0] : null;

        if (stalkPoint &&
            !this.currentStalkers &&
            stalkPoint.top < (scrollY + this.stalkyOptions.stickY) &&
            scrollY + stalkPoint.height < this.containerBottom) {

            this.floatStalkers();
            this.stalkyOptions.onMiddle();
        } else if (stalkPoint && this.currentStalkers && (scrollY + stalkPoint.height > this.containerBottom)) {
            this.fixStalkersBottom();
        } else if (stalkPoint && this.currentStalkers && (scrollY < this.containerTop)) {
            this.fixStalkersTop();
        }
    }
}(jQuery));
