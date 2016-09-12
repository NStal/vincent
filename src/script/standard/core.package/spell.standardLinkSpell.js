// Generated by CoffeeScript 1.10.0
(function() {
  var LinkSpell, StandardLinkSpell,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  LinkSpell = require("./base/spell.link");

  StandardLinkSpell = (function(superClass) {
    var reg;

    extend(StandardLinkSpell, superClass);

    reg = new RegExp('(([0-9a-zA-Z\\.\\-]+):)(//([^`/?#\\(\\) \n*]*))([^`?# \\(\\)\n*]*)(\\?([^#\\(\\) \n`*]*))?(#([^\\(\\) \n`*]*))?');

    StandardLinkSpell.prototype.test = function(contentString) {
      var match;
      if (contentString == null) {
        contentString = "";
      }
      match = contentString.match(reg);
      if (match) {
        return {
          start: match.index,
          end: match.index + match[0].length,
          match: match
        };
      }
      return null;
    };

    StandardLinkSpell.prototype.type = "StandardLinkSpell";

    function StandardLinkSpell(context, option) {
      this.context = context;
      this.option = option != null ? option : {};
      StandardLinkSpell.__super__.constructor.call(this, this.context, this.option);
    }

    StandardLinkSpell.prototype.parse = function() {
      var match, url;
      match = this.contentString.match(reg);
      url = match[0];
      if (url !== this.url) {
        this.url = url;
      }
      return this.url || null;
    };

    StandardLinkSpell.prototype.compose = function() {
      var match, ref, ref1, url;
      match = this.contentString.match(reg);
      if (!match || match.index !== 0 || match[0].length !== this.length) {
        this.toNormalTextInPlace();
        this.dirty = true;
        if ((ref = this.parent) != null) {
          ref.dirty = true;
        }
        return true;
      }
      url = match[0];
      if (url !== this.url) {
        this.url = url;
        if ((ref1 = this.parent) != null) {
          ref1.dirty = true;
        }
        this.dirty = true;
      }
      return false;
    };

    return StandardLinkSpell;

  })(LinkSpell);

  module.exports = StandardLinkSpell;

}).call(this);
