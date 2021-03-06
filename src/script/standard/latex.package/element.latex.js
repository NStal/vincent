// Generated by CoffeeScript 1.10.0
(function() {
  var COMContainer, COMRichText, Decoration, LanguageManager, Latex, LatexBlockHead, LatexBlockTail, LatexDecoration, LatexDecorationMaintainer, LatexDomain, LatexView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Decoration = COM.COMDecoration;

  COMContainer = COM.COMContainer;

  COMRichText = COM.COMRichText;

  LatexBlockHead = require("./spell.latexBlockHead");

  LatexBlockTail = require("./spell.latexBlockTail");

  LatexView = (function(superClass) {
    extend(LatexView, superClass);

    function LatexView(latex) {
      var template;
      this.latex = latex;
      template = "<div class=\"com com-rich-text com-latex-block\"><div data-id=\"container\" class=\"container\"></div><div data-id=\"renderer\" class=\"latex-renderer\"></div></div>";
      LatexView.__super__.constructor.call(this, template);
    }

    LatexView.prototype.render = function(content) {
      if (this.cacheTex === content) {
        return;
      }
      this.UI.renderer.textContent = "$$" + content + "$$";
      return this.latex.context.facilities.latex.renderTexElement(this.UI.renderer, (function(_this) {
        return function() {
          _this.latex.context.castIntent("RenderIntent");
          return _this.cacheTex = content;
        };
      })(this));
    };

    return LatexView;

  })(Leaf.Widget);

  Latex = (function(superClass) {
    extend(Latex, superClass);

    Latex.prototype.type = "Latex";

    Latex.prototype.mime = "text/plain";

    function Latex() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      this.appearance = {
        tagName: "code",
        classList: ["com", "com-rich-text", "com-latex-block"]
      };
      this.childNoTailingBoundary = true;
      Latex.__super__.constructor.apply(this, args);
      this.availableSpells = [LatexBlockHead, LatexBlockTail];
      this.decorationMaintainers = [];
      this.layout = "block";
      this.composePolicy.behave({
        borrow: true,
        lend: false,
        tailingNewline: true
      });
    }

    Latex.prototype.compose = function() {
      return Latex.__super__.compose.call(this);
    };

    Latex.prototype.retainSpells = function() {
      var changed, i, index, item, len, texts;
      texts = this.children.slice();
      for (index = i = 0, len = texts.length; i < len; index = ++i) {
        item = texts[index];
        if (item instanceof LatexBlockHead && index !== 0) {
          item.remove();
          changed = true;
        }
        if (item instanceof LatexBlockTail && index !== texts.length - 1) {
          item.remove();
          changed = true;
        }
      }
      return changed || false;
    };

    Latex.prototype.computeDecoration = function() {
      var ref, ref1;
      if (((ref = this.children[0]) != null ? ref.type : void 0) === "LatexBlockHead") {
        this.language = (ref1 = this.children[0]) != null ? typeof ref1.getLanguage === "function" ? ref1.getLanguage() : void 0 : void 0;
        if (this.language !== this.lastLanguage) {
          this.setLanguage(this.language);
        }
      }
      this.lastLanguage = this.language;
      return Latex.__super__.computeDecoration.call(this);
    };

    Latex.prototype.normalizeTexts = function() {
      var atSplit, change, contentString, end, firstLine, i, index, item, j, k, lastLine, len, len1, part, parts, texts, toMerge;
      texts = this.children.slice();
      toMerge = "";
      for (index = i = 0, len = texts.length; i < len; index = ++i) {
        item = texts[index];
        if (toMerge) {
          change = true;
          item.insertText(0, toMerge);
          toMerge = "";
        }
        contentString = item.contentString;
        parts = contentString.split("\n");
        if (parts.length === 1 && index !== texts.length - 1) {
          change = true;
          toMerge = contentString;
          item.remove();
          continue;
        } else if (parts.length === 1 && index === texts.length - 1) {
          break;
        } else if (parts.length === 2 && parts[1] === "") {
          continue;
        }
        change = true;
        atSplit = contentString;
        if (index !== texts.length - 1) {
          firstLine = parts.shift();
          lastLine = parts.pop();
          item.removeText(0);
          item.insertText(0, firstLine + "\n");
          for (j = parts.length - 1; j >= 0; j += -1) {
            part = parts[j];
            item.after(this.context.createElement("Text", {
              contentString: part + "\n"
            }));
          }
          if (lastLine) {
            toMerge = lastLine;
          }
        } else {
          lastLine = parts.pop();
          if (!lastLine) {
            lastLine = parts.pop();
          }
          end = item.contentString.lastIndexOf(lastLine);
          item.removeText(0, end);
          for (k = 0, len1 = parts.length; k < len1; k++) {
            part = parts[k];
            item.before(this.context.createElement("Text", {
              contentString: part + "\n"
            }));
          }
        }
        continue;
      }
      if (toMerge) {
        change = true;
        this.append(this.context.createElement("Text", {
          contentString: toMerge
        }));
      }
      return change || false;
    };

    Latex.prototype.castSpells = function() {
      var first, has, last;
      first = this.children[0];
      if (!(first instanceof LatexBlockHead)) {
        has = true;
        new LatexBlockHead(this.context).castToText(first, 0, first.length);
      }
      last = this.last();
      if (!(last instanceof LatexBlockTail)) {
        has = true;
        new LatexBlockTail(this.context).castToText(last, 0, last.length);
      }
      return has || false;
    };

    Latex.prototype.acknowledge = function() {
      var reg;
      reg = /\$\$(.*)/;
      this.contentString.match(reg);
      return false;
    };

    Latex.prototype.setLanguage = function(language) {
      var plugin;
      this.decorationMaintainers.length = 0;
      plugin = Latex.languages.get(language);
      if (plugin != null ? plugin.decoration : void 0) {
        return this.decorationMaintainers.push(plugin.decoration);
      }
    };

    Latex.prototype.customBaseRender = function() {
      var i, item, len, ref, ref1;
      if (!this.cache.view) {
        this.cache.view = new LatexView(this);
        this.cache.renderer = this.cache.view.UI.renderer;
      }
      this.el = this.cache.view.node;
      this.el.com = this;
      ref1 = ((ref = this.appearance) != null ? ref.classList : void 0) || [];
      for (i = 0, len = ref1.length; i < len; i++) {
        item = ref1[i];
        this.el.classList.add(item);
      }
      return true;
    };

    Latex.prototype.specifyDomContainer = function() {
      return this.domContainer = this.cache.view.UI.container;
    };

    Latex.prototype.render = function() {
      var content, cs, e, end, error, ref, start;
      Latex.__super__.render.call(this);
      try {
        this.cache.renderer.classList.remove("error");
        cs = this.contentString;
        start = cs.indexOf("$") + 2;
        end = cs.lastIndexOf("$") - 1;
        content = cs.slice(start, end);
        this.cache.view.render(content);
        if (/^(\s|\n)*$/.test(content)) {
          return this.el.classList.add("empty");
        } else {
          return this.el.classList.remove("empty");
        }
      } catch (error) {
        e = error;
        this.cache.renderer.classList.add("error");
        return this.cache.renderer.innerHTML = ((ref = cs.slice(start, end)) != null ? ref.trim() : void 0) + ":" + (JSON.stringify(e, null, 4));
      }
    };

    return Latex;

  })(COMRichText);

  LanguageManager = (function() {
    function LanguageManager() {
      this.languages = {};
    }

    LanguageManager.prototype.get = function(language) {
      return this.languages[language] || null;
    };

    LanguageManager.prototype.registerLanguageHighlight = function(name, domain) {
      var base, lang;
      if ((base = this.languages)[name] == null) {
        base[name] = {};
      }
      lang = this.languages[name];
      return lang.decoration = new LatexDecorationMaintainer(name, domain);
    };

    return LanguageManager;

  })();

  Latex.languages = new LanguageManager();

  Latex.registerLanguageHighlight = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.languages).registerLanguageHighlight.apply(ref, args);
  };

  LatexDomain = (function() {
    function LatexDomain(info) {
      var i, item, len, source, sources;
      this.targets = [];
      this.subDomains = [];
      sources = [];
      for (i = 0, len = info.length; i < len; i++) {
        item = info[i];
        this.targets.push(item);
        if (item.domain) {
          this.subDomains.push(new LatexDomain(item.domain));
        } else {
          this.subDomains.push(null);
        }
      }
      source = this.targets.map(function(item) {
        if (item.type === "keyword") {
          return "(\\b" + item.source + "\\b)";
        } else {
          return "(" + item.source + ")";
        }
      }).join("|");
      if (!source) {
        this.reg = null;
      }
      this.reg = new RegExp(source, "g");
    }

    LatexDomain.prototype.analyze = function(string, offset) {
      var content, index, match, result, subDomain, target;
      if (offset == null) {
        offset = 0;
      }
      if (!this.reg) {
        return [];
      }
      result = [];
      while (match = this.reg.exec(string)) {
        if (match[0].length === 0) {
          throw new Error("empty latex parsing!");
        }
        index = this.getMatchIndex(match);
        if (index < 0) {
          throw new Error("unexpected parse match", match, this.reg);
        }
        content = match[index];
        target = this.targets[index - 1];
        result.push({
          start: match.index + offset,
          length: match[0].length,
          type: target.type || "custom",
          name: target.name
        });
        if (target.domain && (subDomain = this.subDomains[index - 1])) {
          result.push.apply(result, subDomain.analyze(match[0], match.index + offset));
        }
      }
      return result;
    };

    LatexDomain.prototype.getMatchIndex = function(reg) {
      var i, index, ref;
      for (index = i = 1, ref = reg.length; 1 <= ref ? i < ref : i > ref; index = 1 <= ref ? ++i : --i) {
        if (reg[index]) {
          return index;
        }
      }
      return -1;
    };

    return LatexDomain;

  })();

  LatexDecorationMaintainer = (function(superClass) {
    extend(LatexDecorationMaintainer, superClass);

    function LatexDecorationMaintainer(language1, domain1) {
      this.language = language1;
      this.domain = domain1;
      if (this.domain) {
        this.analyzer = new LatexDomain(this.domain);
      }
    }

    LatexDecorationMaintainer.prototype.compute = function(string) {
      var i, item, len, result;
      result = this.analyzer.analyze(string);
      this.decorations = [];
      for (i = 0, len = result.length; i < len; i++) {
        item = result[i];
        this.decorations.push(new LatexDecoration(this, item.start, item.start + item.length, {
          classes: ["latex-highlight-" + item.type, "latex-highlight-" + item.type + "-" + (item.name || "anonymous")]
        }));
      }
      return this.decorations;
    };

    return LatexDecorationMaintainer;

  })(Decoration.DecorationMaintainer);

  LatexDecoration = (function(superClass) {
    extend(LatexDecoration, superClass);

    function LatexDecoration(maintainer, start1, end1, styles) {
      this.maintainer = maintainer;
      this.start = start1;
      this.end = end1;
      this.styles = styles != null ? styles : {};
      this.isLatex = true;
    }

    LatexDecoration.prototype.apply = function(el) {
      var ref;
      return (ref = el.classList).add.apply(ref, this.styles.classes || []);
    };

    LatexDecoration.prototype.equal = function(target) {
      return target.isLatex && target.start === this.start && target.end === this.end && this.maintainer.language === target.maintainer.language;
    };

    return LatexDecoration;

  })(Decoration);

  module.exports = Latex;

}).call(this);
