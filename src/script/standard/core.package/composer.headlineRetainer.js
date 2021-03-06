// Generated by CoffeeScript 1.10.0
(function() {
  var Composer, DividerRetainer, LeftInvokeOneLineElementRetainer,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Composer = require("../helper/composerUtils");

  LeftInvokeOneLineElementRetainer = Composer.LeftInvokeOneLineElementRetainer;

  module.exports = DividerRetainer = (function(superClass) {
    extend(DividerRetainer, superClass);

    function DividerRetainer() {
      return DividerRetainer.__super__.constructor.apply(this, arguments);
    }

    DividerRetainer.prototype.type = "Divider";

    DividerRetainer.prototype.reg = /^((===+)|(---+)) *\n?$/;

    return DividerRetainer;

  })(LeftInvokeOneLineElementRetainer);

}).call(this);
