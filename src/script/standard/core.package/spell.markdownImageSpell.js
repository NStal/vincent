// Generated by CoffeeScript 1.10.0
(function() {
  var COMSpell, Decoration, ImageStateTrait, MarkdownImageSpell, SmartImage,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  COMSpell = require("/vincent/com/spell");

  Decoration = require("/vincent/com/decoration");

  SmartImage = require("/widget/smartImage");

  MarkdownImageSpell = (function(superClass) {
    var ImageView, reg;

    extend(MarkdownImageSpell, superClass);

    reg = /\!\[([^\[\]]*)\]\(([^\(\)\n]*)\)/;

    ImageView = (function(superClass1) {
      extend(ImageView, superClass1);

      function ImageView(renderContext) {
        this.renderContext = renderContext;
        this.include(SmartImage);
        this.template = "<inline-image class=\"com com-markdown-image com-text com-block-like\" data-class=\"state\"><smart-image data-id=\"renderer\" class=\"image-renderer com-block-like-renderer\"></smart-image><div data-id=\"texts\" class=\"com-block-like-texts com-no-trigger print-not\"></div></inline-image>";
        ImageView.__super__.constructor.call(this);
        this.UI.renderer.on("state", (function(_this) {
          return function(state) {
            _this.renderContext.emit("resize");
            if (state === "failed") {
              return _this.VM.state = "error";
            } else {
              return _this.VM.state = state;
            }
          };
        })(this));
      }

      return ImageView;

    })(Leaf.Widget);

    MarkdownImageSpell.prototype.type = "MarkdownImageSpell";

    MarkdownImageSpell.prototype.toPlainString = function() {
      this.parse();
      return this.alt || this.toHumanString();
    };

    MarkdownImageSpell.prototype.test = function(contentString) {
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

    function MarkdownImageSpell() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (this.appearance == null) {
        this.appearance = {
          tagName: "code",
          classList: ["com", "com-markdown-image", "com-text"]
        };
      }
      MarkdownImageSpell.__super__.constructor.apply(this, args);
      this.leftCaretPriority = 1;
      this.rightCaretPriority = 1;
      this.withHolder = true;
      new ImageStateTrait(this);
    }

    MarkdownImageSpell.prototype.getOffsetByDOM = function(node, offset) {
      var ref;
      if (node === ((ref = this.cache) != null ? ref.renderer : void 0)) {
        return {
          index: this.length - 1,
          inside: false
        };
      }
      return null;
    };

    MarkdownImageSpell.prototype.specifyTextContainer = function() {
      return this.cache.view.UI.texts;
    };

    MarkdownImageSpell.prototype.customBaseRender = function() {
      var base;
      if ((base = this.cache).view == null) {
        base.view = new ImageView(this.rc);
      }
      this.cache.renderer = this.cache.view.UI.renderer;
      this.cache.view.UI.texts.innerHTML = "";
      return this.el = this.cache.view.node;
    };

    MarkdownImageSpell.prototype.parse = function() {
      var _, match;
      match = this.contentString.match(reg);
      if (!match) {
        return;
      }
      _ = match[0], this.alt = match[1], this.src = match[2];
    };

    MarkdownImageSpell.prototype.render = function() {
      var args, view;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      MarkdownImageSpell.__super__.render.apply(this, args);
      this.parse();
      view = this.cache.view;
      if (!this.src) {
        view.VM.empty = true;
        this.cache.renderer.src = "";
        return this.cache.renderer.alt = this.alt || "";
      } else {
        view.VM.empty = false;
        if (this.cache.renderer.src !== this.src) {
          this.cache.renderer.src = this.src;
        }
        if (this.cache.renderer.alt !== this.alt) {
          return this.cache.renderer.alt = this.alt || "";
        }
      }
    };

    MarkdownImageSpell.prototype.compose = function() {
      var match;
      match = this.contentString.match(reg);
      if (!match || match.index !== 0 || match[0].length !== this.length) {
        this.toNormalTextInPlace();
        this.dirty = true;
        return true;
      }
      this.parse();
      return false;
    };

    return MarkdownImageSpell;

  })(COMSpell);

  ImageStateTrait = (function(superClass) {
    extend(ImageStateTrait, superClass);

    function ImageStateTrait() {
      return ImageStateTrait.__super__.constructor.apply(this, arguments);
    }

    ImageStateTrait.prototype.initialize = function() {
      var CDNResource;
      CDNResource = require("/webService/CDNResource");
      return this.loadingSrc = CDNResource.loadingHintGif;
    };

    ImageStateTrait.prototype.setSrc = function(src) {
      var App;
      App = require("/app");
      return App.imageLoader.load({
        src: src
      }, (function(_this) {
        return function(err, image) {
          if (err) {
            _this.setFail(reason);
            return;
          }
          return _this.UI.renderer.src = image.src;
        };
      })(this));
    };

    ImageStateTrait.prototype.setFail = function(reason) {
      return this.UI["return"];
    };

    return ImageStateTrait;

  })(Leaf.Trait);

  module.exports = MarkdownImageSpell;

}).call(this);