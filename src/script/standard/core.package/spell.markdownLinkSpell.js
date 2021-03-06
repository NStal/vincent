// Generated by CoffeeScript 1.10.0
(function() {
  var Decoration, LinkSpell, MarkdownLinkSpell,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  LinkSpell = require("./base/spell.link");

  Decoration = require("/vincent/com/decoration");

  MarkdownLinkSpell = (function(superClass) {
    var DM, LinkView, dm, reg;

    extend(MarkdownLinkSpell, superClass);

    DM = Decoration.createRegExpMaintainer("MarkdownLinkSpellDecoration", /\[((?:[^\[\]])*)\]\((([^\(\)\n\\ ]|(\\\()|(\\\))|(\\\\))*)( [^\)\n]*)?\)/g, [], {
      parts: [
        {
          reg: /\((([^\(\)\n\\ ]|(\\\()|(\\\))|(\\\\))*)( [^\)\n]*)?\)$/g,
          classes: ["edit-spell-decorator"]
        }, {
          reg: /^\[|\]/g,
          classes: ["edit-spell-decorator"]
        }
      ]
    });

    dm = new DM;

    reg = /\[([^\[\]]*)\]\(([^\(\)\n ]*)( [^\)\n]*)?\)/;

    reg = /\[([^\[\]]*)\]\((([^\(\)\n\\ ]|(\\\()|(\\\))|(\\\\))*)( [^\)\n]*)?\)/;

    reg = /\[((?:[^\[\]]|(?:\\\[)|(?:\\\]))*)\]\((([^\(\)\n\\ ]|(\\\()|(\\\))|(\\\\))*)( [^\)\n]*)?\)/;

    LinkView = (function(superClass1) {
      extend(LinkView, superClass1);

      function LinkView(renderContext) {
        this.renderContext = renderContext;
        this.template = "<markdown-link class=\"com com-markdown-link com-text com-block-like\" data-class=\"state\"><a data-id=\"renderer\" class=\"image-renderer com-block-like-renderer\"></a><div data-id=\"texts\" class=\"com-block-like-texts com-no-trigger print-not\"></div></markdown-link>";
        LinkView.__super__.constructor.call(this);
      }

      LinkView.prototype.setContent = function(url, hint) {
        this.UI.renderer.setAttribute("href", url);
        if (hint) {
          hint = hint.replace(/\\\\/g, "\\").replace(/\\\[/g, "[").replace(/\\\]/g, "]");
        }
        if (hint) {
          this.UI.renderer.textContent = hint;
          this.node.classList.remove("raw-url");
        } else {
          this.UI.renderer.textContent = url;
          this.node.classList.add("raw-url");
        }
        if (!url && !hint) {
          this.UI.renderer.textContent = "[]()";
          this.node.classList.add("empty");
        } else {
          this.node.classList.remove("empty");
        }
        return true;
      };

      return LinkView;

    })(Leaf.Widget);

    MarkdownLinkSpell.prototype.test = function(contentString) {
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

    MarkdownLinkSpell.prototype.toPlainString = function() {
      this.parse();
      return this.hint || this.url || this.toHumanString();
    };

    MarkdownLinkSpell.prototype.type = "MarkdownLinkSpell";

    function MarkdownLinkSpell(context, option) {
      this.context = context;
      this.option = option != null ? option : {};
      MarkdownLinkSpell.__super__.constructor.call(this, this.context, this.option);
      this.addDecorationMaintainer(dm);
    }

    MarkdownLinkSpell.prototype.specifyTextContainer = function() {
      return this.cache.view.UI.texts;
    };

    MarkdownLinkSpell.prototype.customBaseRender = function() {
      var base;
      if ((base = this.cache).view == null) {
        base.view = new LinkView(this.rc);
      }
      this.cache.renderer = this.cache.view.UI.renderer;
      this.cache.view.UI.texts.innerHTML = "";
      return this.el = this.cache.view.node;
    };

    MarkdownLinkSpell.prototype.render = function() {
      var args, view;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      MarkdownLinkSpell.__super__.render.apply(this, args);
      this.parse();
      view = this.cache.view;
      return view.setContent(this.url, this.hint);
    };

    MarkdownLinkSpell.prototype.parse = function() {
      var _, match, ref, ref1, title, url;
      match = this.contentString.match(reg);
      if (!match) {
        return;
      }
      _ = match[0], this.hint = match[1], url = match[2], _ = match[3], _ = match[4], _ = match[5], _ = match[6], title = match[7];
      this.url = url.replace(/\\\\/g, "\\").replace(/\\\(/g, "(").replace(/\\\)/g, ")");
      if (title) {
        title = title.trim();
        if ((ref = title[0]) === "\"" || ref === "'") {
          title = title.slice(1);
        }
        if ((ref1 = title[title.length - 1]) === "\"" || ref1 === "'") {
          title = title.slice(0, -1);
        }
        if (title !== this.title) {
          this.title = title;
        }
      } else {
        this.title = this.url;
      }
      return this.url;
    };

    MarkdownLinkSpell.prototype.compose = function() {
      var _, hint, match, ref, ref1, title, url;
      match = this.contentString.match(reg);
      if (!match || match.index !== 0 || match[0].length !== this.length) {
        this.toNormalTextInPlace();
        this.dirty = true;
        return true;
      }
      _ = match[0], hint = match[1], url = match[2], title = match[3];
      if (url !== this.url) {
        this.url = url;
        this.dirty = true;
      }
      if (hint !== this.hint) {
        this.hint = hint;
        this.dirty = true;
      }
      if (title) {
        title = title.trim();
        if ((ref = title[0]) === "\"" || ref === "'") {
          title = title.slice(1);
        }
        if ((ref1 = title[title.length - 1]) === "\"" || ref1 === "'") {
          title = title.slice(0, -1);
        }
        if (title !== this.title) {
          this.title = title;
          this.dirty = true;
        }
      }
      return false;
    };

    return MarkdownLinkSpell;

  })(LinkSpell);

  module.exports = MarkdownLinkSpell;

}).call(this);
