// Generated by CoffeeScript 1.10.0
(function() {
  var COMDecoration, COMRichText, Quote, QuoteHeadHighlight, QuoteHeadReg, QuoteHeadRegG,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  COMRichText = COM.COMRichText;

  COMDecoration = COM.COMDecoration;

  Quote = (function(superClass) {
    extend(Quote, superClass);

    Quote.preferedUnorderedPrefix = "*";

    Quote.QuoteHeadReg;

    Quote.isContentMatchQuote = function(content) {
      return /^( *)(?:-|\*|[0-9]+\.) +.*\n?$/.test(content);
    };

    Quote.prototype.type = "Quote";

    Quote.prototype.onRootAvailable = function() {
      Quote.__super__.onRootAvailable.call(this);
      return this.pend();
    };

    Quote.prototype.isSingleLine = true;

    function Quote(context, data) {
      this.context = context;
      this.data = data != null ? data : {};
      this.appearance = {
        tagName: "span",
        classList: ["com", "com-rich-text", "com-quote", "com-el-single-line"]
      };
      Quote.__super__.constructor.call(this, this.context, this.data);
      if (Quote.headHighlight == null) {
        Quote.headHighlight = new QuoteHeadHighlight();
      }
      this.decorationMaintainers.push(Quote.headHighlight);
      this.composePolicy.behave({
        borrow: true,
        lend: false,
        tailingNewline: true
      });
      this.layout = "block";
      return this;
    }

    Quote.prototype.isEmpty = function() {
      return this.contentString.trim().indexOf(" ") < 0;
    };

    Quote.prototype.anchorAtBeginText = function() {
      var anchor, ref;
      anchor = this.anchor.clone();
      anchor.index = ((ref = this.getHead()) != null ? ref.length : void 0) || 0;
      return anchor;
    };

    Quote.prototype.trigger = function(option) {
      if (option == null) {
        option = {};
      }
      return false;
    };

    Quote.prototype.render = function(rc) {
      Quote.__super__.render.call(this, rc);
      return true;
    };

    Quote.prototype.clone = function() {
      var result;
      result = Quote.__super__.clone.call(this);
      if (!result) {
        return result;
      }
      return result;
    };

    Quote.prototype.toHumanString = function() {
      return Quote.__super__.toHumanString.call(this);
    };

    Quote.prototype.toJSON = function(option) {
      var json;
      json = Quote.__super__.toJSON.call(this, option);
      if (!json) {
        return null;
      }
      return json;
    };

    Quote.prototype.getHead = function() {
      var contentString, index;
      contentString = this.contentString;
      index = 0;
      while (contentString[index] === " ") {
        index += 1;
      }
      return contentString.slice(0, index + 1);
    };

    Quote.prototype.getHeadPrefix = function() {
      return this.getHead().trim();
    };

    Quote.prototype.getHead = function() {
      var match;
      match = this.contentString.match(QuoteHeadReg);
      if (!match) {
        return "";
      }
      return match[0];
    };

    return Quote;

  })(COMRichText);

  QuoteHeadReg = /^\s*> /;

  QuoteHeadRegG = /^\s*> /g;

  QuoteHeadHighlight = COMDecoration.createRegExpMaintainer("QuoteHead", QuoteHeadRegG, ["com-inline-quote-head"]);

  module.exports = Quote;

}).call(this);
