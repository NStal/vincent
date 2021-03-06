// Generated by CoffeeScript 1.10.0
(function() {
  var COMRune, COMUnknownRune, i18n,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  i18n = require("./i18n");

  COMRune = require("./rune");

  COMUnknownRune = (function(superClass) {
    extend(COMUnknownRune, superClass);

    COMUnknownRune.prototype.type = "UnknownRune";

    function COMUnknownRune(context, data) {
      var ref;
      this.context = context;
      this.data = data != null ? data : {
        detail: null
      };
      COMUnknownRune.__super__.constructor.call(this, this.context, this.data);
      if ((ref = this.appearance.classList) != null) {
        ref.push("com-unknown-rune");
      }
    }

    COMUnknownRune.prototype.render = function() {
      var ref, ref1, ref2, title;
      COMUnknownRune.__super__.render.call(this);
      title = i18n.UnknownRuneTitle;
      if ((ref = this.el) != null) {
        ref.title = title;
      }
      if ((ref1 = this.el) != null) {
        ref1.setAttribute("title", title);
      }
      return (ref2 = this.el) != null ? ref2.onclick = (function(_this) {
        return function() {
          var ref3;
          return Logger.error("UnknownRuneDetail", JSON.stringify((ref3 = _this.data) != null ? ref3.detail : void 0, null, 4));
        };
      })(this) : void 0;
    };

    COMUnknownRune.prototype.toJSON = function() {
      return this.data.detail;
    };

    return COMUnknownRune;

  })(COMRune);

  module.exports = COMUnknownRune;

}).call(this);
