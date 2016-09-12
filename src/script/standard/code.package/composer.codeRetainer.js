// Generated by CoffeeScript 1.10.0
(function() {
  var CodeRetainer, Composer, PairedElementRetainer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Composer = require("../helper/composerUtils");

  PairedElementRetainer = Composer.PairedElementRetainer;

  CodeRetainer = (function(superClass) {
    extend(CodeRetainer, superClass);

    function CodeRetainer() {
      return CodeRetainer.__super__.constructor.apply(this, arguments);
    }

    CodeRetainer.prototype.type = "Code";

    CodeRetainer.prototype.reg = /^(?: *```.*\n)(?:[^`]|(\\`))*``` *\n?$/;

    CodeRetainer.prototype.reg = /^(?: *```.*\n)[\s\S]*?``` *\n?/;

    CodeRetainer.prototype.fastRetain = function(cs) {
      if (cs.slice(0, 3) === "```" && cs.slice(-4) === "```\n") {
        return true;
      }
      return false;
    };

    return CodeRetainer;

  })(PairedElementRetainer);

  module.exports = CodeRetainer;

}).call(this);