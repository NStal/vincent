// Generated by CoffeeScript 1.10.0
(function() {
  var COMSpell, COMText, Errors,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  COMText = require("./text");

  Errors = require("./errors");

  COMSpell = (function(superClass) {
    extend(COMSpell, superClass);

    COMSpell.prototype.test = function() {
      return false;
    };

    COMSpell.prototype.type = "Spell";

    COMSpell.prototype.isSpell = true;

    function COMSpell(context, option1) {
      this.context = context;
      this.option = option1 != null ? option1 : {};
      this.decorationMaintainers = [];
      COMSpell.__super__.constructor.call(this, this.context, this.option);
      this.decorationPolicy.behave({
        behavior: "singular"
      });
    }

    COMSpell.prototype.addDecorationMaintainer = function(maintainer) {
      return this.decorationMaintainers.push(maintainer);
    };

    COMSpell.prototype.toNormalTextInPlace = function() {
      return this.replaceBy(new COMText(this.context, {
        contentString: this.contentString
      }));
    };

    COMSpell.prototype.render = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return COMSpell.__super__.render.apply(this, args);
    };

    COMSpell.prototype.setDecorations = function(decs) {
      var _decs, cs, dm, i, len, ref;
      if (this.decorationPolicy.behavior === "break") {
        decs = [];
      }
      if (decs == null) {
        decs = [];
      }
      cs = this.contentString;
      ref = this.decorationMaintainers;
      for (i = 0, len = ref.length; i < len; i++) {
        dm = ref[i];
        _decs = dm.compute(cs);
        decs.push.apply(decs, _decs);
      }
      return COMSpell.__super__.setDecorations.call(this, decs);
    };

    COMSpell.prototype.castToText = function(text, start, end) {
      var last, middle, ref;
      if (end < start) {
        throw new Errors.LogicError("end should larger that start");
      }
      middle = text.splitInPlace(start);
      if (!middle) {
        middle = text;
      }
      last = middle.splitInPlace(end - start) || null;
      middle.replaceBy(this);
      this.contentString = middle.contentString;
      this.compose();
      this.dirty = true;
      if ((ref = this.parent) != null) {
        ref.dirty = true;
      }
      return last;
    };

    COMSpell.prototype.compose = function() {
      this.setDecorations();
      return false;
    };

    COMSpell.prototype.toJSON = function(option) {
      var json;
      json = COMSpell.__super__.toJSON.call(this, option);
      if (!json) {
        return null;
      }
      json.spell = true;
      return json;
    };

    return COMSpell;

  })(COMText);

  module.exports = COMSpell;

}).call(this);
