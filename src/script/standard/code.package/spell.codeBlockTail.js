// Generated by CoffeeScript 1.10.0
(function() {
  var COMSpell, CodeBlockTail,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  COMSpell = COM.COMSpell;

  module.exports = CodeBlockTail = (function(superClass) {
    var reg;

    extend(CodeBlockTail, superClass);

    reg = /^ *```(.*)\n/;

    CodeBlockTail.prototype.type = "CodeBlockTail";

    CodeBlockTail.prototype.test = function(contentString, index, completeString) {
      if (contentString == null) {
        contentString = "";
      }
      return null;
    };

    function CodeBlockTail(context, option) {
      this.context = context;
      this.option = option;
      this.appearance = {
        tagName: "span",
        classList: ["com", "com-text", "com-code-tail"]
      };
      this.noTailingBoundary = true;
      CodeBlockTail.__super__.constructor.call(this, this.context, this.option);
    }

    CodeBlockTail.prototype.compose = function() {
      return false;
    };

    return CodeBlockTail;

  })(COMSpell);

}).call(this);
