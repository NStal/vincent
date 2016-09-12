// Generated by CoffeeScript 1.10.0
(function() {
  var LatexRuneView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  App.tm.use("package/latex/latexRuneView");

  LatexRuneView = (function(superClass) {
    extend(LatexRuneView, superClass);

    function LatexRuneView(latexRune) {
      this.latexRune = latexRune;
      LatexRuneView.__super__.constructor.call(this, App.templates["package"].latex.latexRuneView);
    }

    LatexRuneView.prototype.render = function() {
      var content;
      content = this.latexRune.latex || "\\rm\\LaTeX";
      if (this.cacheTex === content) {
        return;
      }
      this.UI.renderer.textContent = "$" + content + "$";
      this.VM.rendering = true;
      return this.latexRune.context.facilities.latex.renderTexElement(this.UI.renderer, (function(_this) {
        return function() {
          _this.VM.rendering = false;
          _this.cacheTex = content;
          return _this.latexRune.context.castIntent("RenderIntent");
        };
      })(this));
    };

    return LatexRuneView;

  })(Leaf.Widget);

  module.exports = LatexRuneView;

}).call(this);
