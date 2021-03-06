// Generated by CoffeeScript 1.10.0
(function() {
  var Composer, PairedElementRetainer, TocRetainer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Composer = require("../helper/composerUtils");

  PairedElementRetainer = Composer.PairedElementRetainer;

  module.exports = TocRetainer = (function(superClass) {
    extend(TocRetainer, superClass);

    function TocRetainer() {
      return TocRetainer.__super__.constructor.apply(this, arguments);
    }

    TocRetainer.prototype.type = "Toc";

    TocRetainer.prototype.reg = /^\[toc\] *\n?$/i;

    return TocRetainer;

  })(PairedElementRetainer);

}).call(this);
