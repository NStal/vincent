// Generated by CoffeeScript 1.10.0
(function() {
  var Composer, PairedElementExtractor, RichTextToCode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Composer = require("../helper/composerUtils");

  PairedElementExtractor = Composer.PairedElementExtractor;

  RichTextToCode = (function(superClass) {
    extend(RichTextToCode, superClass);

    function RichTextToCode() {
      return RichTextToCode.__super__.constructor.apply(this, arguments);
    }

    RichTextToCode.prototype.type = "RichText";

    RichTextToCode.prototype.renderTargetType = "Code";

    RichTextToCode.prototype.reg = /(?:\n|^)(?: *```[^`\n]*\n)(?:[^`]|\\`)*?(?:``` *)(?:\n|$)/;

    RichTextToCode.prototype.reg = /(?:\n|^)(?: *```[^`\n]*\n)[\s\S]*?(?:``` *)(?:\n|$)/;

    return RichTextToCode;

  })(PairedElementExtractor);

  module.exports = RichTextToCode;

}).call(this);
