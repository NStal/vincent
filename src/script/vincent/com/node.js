// Generated by CoffeeScript 1.10.0
(function() {
  var COMNode, COMPath, Errors, EventEmitter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Errors = require("./errors");

  EventEmitter = (require("./events")).EventEmitter;

  COMPath = require("./path");

  COMNode = (function(superClass) {
    extend(COMNode, superClass);

    COMNode.index = 1000;

    COMNode.prototype.type = "Node";

    function COMNode(context) {
      var base, base1;
      this.context = context;
      COMNode.__super__.constructor.call(this);
      this.composerBuffer = {};
      this._id = COMNode.index++;
      this.id = this._id;
      this.type = this.type;
      this.rev = 0;
      this.revisionMarks = {};
      this.parent = null;
      if (this.appearance == null) {
        this.appearance = {};
      }
      if ((base = this.appearance).tagName == null) {
        base.tagName = "div";
      }
      if ((base1 = this.appearance).classList == null) {
        base1.classList = ["com"];
      }
      this.parentAppearance = [];
      this.isCOMObject = true;
      this.pend();
      this.__defineGetter__("dirty", (function(_this) {
        return function() {
          var ref;
          if (!_this.cache) {
            return false;
          }
          return ((ref = _this.cache) != null ? ref.rev : void 0) !== _this.rev || false;
        };
      })(this));
      this.__defineSetter__("dirty", (function(_this) {
        return function(v) {
          var ref;
          if (v) {
            _this.rev += 1;
            if (_this.parent) {
              return _this.parent.dirty = true;
            }
          } else {
            return (ref = _this.cache) != null ? ref.rev = _this.rev : void 0;
          }
        };
      })(this));
      this.__defineGetter__("el", (function(_this) {
        return function() {
          var ref;
          return ((ref = _this.cache) != null ? ref.el : void 0) || null;
        };
      })(this));
      this.__defineSetter__("el", (function(_this) {
        return function(el) {
          if (el != null) {
            el.com = _this;
          }
          return _this.cache.el = el;
        };
      })(this));
      this.__defineGetter__("elAfter", (function(_this) {
        return function() {
          var ref;
          return ((ref = _this.cache) != null ? ref.elAfter : void 0) || null;
        };
      })(this));
      this.__defineSetter__("elAfter", (function(_this) {
        return function(elAfter) {
          if (elAfter != null) {
            elAfter.com = _this;
          }
          return _this.cache.elAfter = elAfter;
        };
      })(this));
      this.__defineGetter__("elBefore", (function(_this) {
        return function() {
          var ref;
          return ((ref = _this.cache) != null ? ref.elBefore : void 0) || null;
        };
      })(this));
      this.__defineSetter__("elBefore", (function(_this) {
        return function(elBefore) {
          if (elBefore != null) {
            elBefore.com = _this;
          }
          return _this.cache.elBefore = elBefore;
        };
      })(this));
      this.__defineGetter__("root", (function(_this) {
        return function() {
          return _this._root || null;
        };
      })(this));
      this.__defineSetter__("root", (function(_this) {
        return function(root) {
          var old;
          old = _this._root;
          _this._root = root;
          if ((!old || !old.withContext) && root && root.withContext) {
            if (typeof _this.onRootAvailable === "function") {
              _this.onRootAvailable();
            }
            return _this.emit("rootAvailable");
          } else if (!root && old && old.withContext) {
            if (typeof _this.onRootDispel === "function") {
              _this.onRootDispel();
            }
            return _this.emit("rootDispel");
          }
        };
      })(this));
      this.commands = {};
      this.anchors = [];
    }

    COMNode.prototype.setRevisionMark = function(mark) {
      return this.revisionMarks[mark] = this.rev;
    };

    COMNode.prototype.beforeMark = function(mark) {
      var ref;
      if (!((ref = this.cache) != null ? ref.rev : void 0)) {
        return true;
      }
      return this.cache.rev < this.revisionMarks[mark];
    };

    COMNode.prototype.setRenderContext = function(rc) {
      this.rc = rc;
      return this.cache = this.rc.cache(this.id);
    };

    COMNode.prototype.sortOf = function(type) {
      return this.context.namespace.sortOf(this, type);
    };

    COMNode.prototype.exec = function() {
      var base, name, params;
      name = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      return typeof (base = this.commands)[name] === "function" ? base[name].apply(base, params) : void 0;
    };

    COMNode.prototype.registerCommand = function(name, fn) {
      return this.commands[name] = fn;
    };

    COMNode.prototype.getPath = function() {
      return COMPath.fromNode(this);
    };

    COMNode.prototype.customBaseRender = function() {
      return false;
    };

    COMNode.prototype.afterRender = function() {
      return this.cache.rev = this.rev;
    };

    COMNode.prototype.render = function(rc, option) {
      var _el;
      if (option == null) {
        option = {};
      }
      if (this.el && !option.force) {
        this.el.com = this;
        return;
      }
      _el = this.el;
      if (this.customBaseRender()) {
        this.el.com = this;
        return true;
      } else {
        this.el = document.createElement(this.appearance.tagName || "div");
        this.appearance.classList.filter(function(item) {
          return item;
        }).map((function(_this) {
          return function(name) {
            if (name) {
              return _this.el.classList.add(name);
            }
          };
        })(this));
      }
      if (_el && _el.parentElement) {
        _el.parentElement.replaceChild(this.el, _el);
      }
      return this.el.com = this;
    };

    COMNode.prototype.before = function(node) {
      var index;
      if (!this.parent) {
        return;
      }
      index = this.parent.indexOf(this);
      return this.parent.insert(index, node);
    };

    COMNode.prototype.after = function(node) {
      var index;
      if (!this.parent) {
        return;
      }
      index = this.parent.indexOf(this);
      return this.parent.insert(index + 1, node);
    };

    COMNode.prototype.previous = function(count) {
      var index;
      if (count == null) {
        count = 1;
      }
      if (!this.parent) {
        return null;
      }
      if (count === 0) {
        return this;
      }
      if (!count) {
        return null;
      }
      index = this.parent.indexOf(this);
      index -= count;
      if (index >= 0) {
        return this.parent.child(index);
      }
      return null;
    };

    COMNode.prototype.replaceBy = function(node) {
      var index, parent;
      if (!this.parent) {
        throw new Errors.LogicError("can't replace orphan node");
      }
      parent = this.parent;
      if (node.parent) {
        node.parent.removeChild(node);
      }
      index = parent.indexOf(this);
      parent.insert(index, node);
      return parent.removeChild(this);
    };

    COMNode.prototype.next = function(count) {
      var index;
      if (count == null) {
        count = 1;
      }
      if (!this.parent) {
        return null;
      }
      if (count === 0) {
        return this;
      }
      if (!count) {
        return null;
      }
      index = this.parent.indexOf(this);
      index += count;
      if (index < this.parent.children.length) {
        return this.parent.child(index);
      }
      return null;
    };

    COMNode.prototype.remove = function() {
      if (this.parent) {
        return this.parent.removeChild(this);
      }
    };

    COMNode.prototype.toJSON = function() {
      var result;
      result = {};
      result.type = this.type || "Void";
      return result;
    };

    COMNode.prototype.compose = function() {
      if (this.context.namespace.compose(this)) {
        return true;
      }
      if (typeof this.acknowledge === "function") {
        this.acknowledge();
      }
      return false;
    };

    COMNode.prototype.onRootDispel = function() {
      return this.context.handleNodeDetach(this);
    };

    COMNode.prototype.onRootAvailable = function() {
      this.context.requestCompose(this);
      if (this.root.rc) {
        this.setRenderContext(this.root.rc);
      }
      return this.context.handleNodeAttach(this);
    };

    COMNode.prototype.forceChange = function() {
      return this.context.forceChange();
    };

    COMNode.prototype.pend = function() {
      this.dirty = true;
      if (this.root) {
        this.context.requestCompose(this);
      }
      this.composerBuffer = {};
      return this.emit("pend");
    };

    COMNode.prototype.acknowledge = function() {
      return false;
    };

    COMNode.prototype.slice = function(option) {
      if (option == null) {
        option = {};
      }
      return this.clone();
    };

    COMNode.prototype.clone = function() {
      var result;
      result = this.context.createElement(this.type, this.toJSON());
      result.isPartial = false;
      return result;
    };

    COMNode.prototype.compareNodePosition = function(b) {
      if (!this.parent && !this.isRoot) {
        return null;
      }
      return this.getPath().compare(b.getPath());
    };

    COMNode.prototype.toHumanString = function() {
      return "";
    };

    COMNode.prototype.toPlainString = function() {
      return this.toHumanString();
    };

    COMNode.prototype.transactTrigger = function() {
      var args, result;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!this.trigger) {
        return false;
      }
      result = false;
      this.context.transact((function(_this) {
        return function() {
          return result = _this.trigger.apply(_this, args);
        };
      })(this));
      return result;
    };

    COMNode.prototype.toMarkdown = function() {
      return this.toHumanString();
    };

    return COMNode;

  })(EventEmitter);

  module.exports = COMNode;

}).call(this);
