// Generated by CoffeeScript 1.10.0
(function() {
  var Composer, LeftInvokeOneLineElementExtractor, Quote, RichTextToQuote,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Composer = require("../helper/composerUtils");

  LeftInvokeOneLineElementExtractor = Composer.LeftInvokeOneLineElementExtractor;

  Quote = require("./element.quote");

  module.exports = RichTextToQuote = (function(superClass) {
    extend(RichTextToQuote, superClass);

    function RichTextToQuote() {
      return RichTextToQuote.__super__.constructor.apply(this, arguments);
    }

    RichTextToQuote.prototype.type = "RichText";

    RichTextToQuote.prototype.reg = /(?:\n|^)( *)> +.*(?:\n|$)/;

    RichTextToQuote.prototype.renderTargetType = "Quote";

    RichTextToQuote.prototype.renderTargetCtor = Quote;

    return RichTextToQuote;

  })(LeftInvokeOneLineElementExtractor);

}).call(this);
