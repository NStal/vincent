// Generated by CoffeeScript 1.10.0
(function() {
  var Composer, HeadlineRetainer, LeftInvokeOneLineElementRetainer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Composer = require("../helper/composerUtils");

  LeftInvokeOneLineElementRetainer = Composer.LeftInvokeOneLineElementRetainer;

  module.exports = HeadlineRetainer = (function(superClass) {
    extend(HeadlineRetainer, superClass);

    function HeadlineRetainer() {
      return HeadlineRetainer.__super__.constructor.apply(this, arguments);
    }

    HeadlineRetainer.prototype.type = "Headline";

    HeadlineRetainer.prototype.reg = /^( *)#{1,6} +.*\n?$/;

    HeadlineRetainer.prototype.atRelease = function(target, replacement) {
      var i, item, items, len, ref, results;
      if (target.isCollapsed && ((ref = target.collapseHeadContents) != null ? ref.length : void 0) > 0 && target.contentString.length > 0) {
        items = target.collapseHeadContents.slice();
        items.reverse();
        results = [];
        for (i = 0, len = items.length; i < len; i++) {
          item = items[i];
          results.push(replacement.after(item));
        }
        return results;
      }
    };

    return HeadlineRetainer;

  })(LeftInvokeOneLineElementRetainer);

}).call(this);
