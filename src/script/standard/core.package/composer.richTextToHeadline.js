// Generated by CoffeeScript 1.10.0
(function() {
  var Composer, LeftInvokeOneLineElementExtractor, RichTextToHeadline,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Composer = require("../helper/composerUtils");

  LeftInvokeOneLineElementExtractor = Composer.LeftInvokeOneLineElementExtractor;

  module.exports = RichTextToHeadline = (function(superClass) {
    extend(RichTextToHeadline, superClass);

    function RichTextToHeadline() {
      return RichTextToHeadline.__super__.constructor.apply(this, arguments);
    }

    RichTextToHeadline.prototype.type = "RichText";

    RichTextToHeadline.prototype.renderTargetType = "Headline";

    RichTextToHeadline.prototype.reg = /(?:\n|^)( *)#{1,6} +.*(?:\n|$)/;

    RichTextToHeadline.prototype.exec = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (RichTextToHeadline.__super__.exec.apply(this, args)) {
        return true;
      }
      return false;
    };

    return RichTextToHeadline;

  })(LeftInvokeOneLineElementExtractor);

}).call(this);
