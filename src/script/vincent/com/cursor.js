// Generated by CoffeeScript 1.10.0
(function() {
  var COMCursor, COMCursorState, COMPath, COMTravelPolicy, CaretUISuggesterTrait, ConductableTrait, CursorActions, CursorCommands, Errors, EventEmitter, IdenticalCursorTrasportable, InputSuggesterTrait, PointableTrait, Teleportable, Trait, TrapableTrait, WalkableTrait, Walker, WalkerRootFirst,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Walker = require("./helper/walker");

  WalkerRootFirst = Walker.WalkerRootFirst;

  COMPath = require("./path");

  Errors = require("./errors");

  EventEmitter = (require("./events")).EventEmitter;

  COMTravelPolicy = require("./travelPolicy");

  Trait = require("./helper/trait");

  COMCursor = (function(superClass) {
    extend(COMCursor, superClass);

    COMCursor.index = 1000;

    function COMCursor(context, option1) {
      this.context = context;
      this.option = option1 != null ? option1 : {};
      COMCursor.__super__.constructor.call(this);
      new WalkableTrait(this);
      new ConductableTrait(this);
      new CaretUISuggesterTrait(this);
      new InputSuggesterTrait(this);
      new TrapableTrait(this);
      new PointableTrait(this);
      new Teleportable(this);
      new IdenticalCursorTrasportable(this);
      this.id = (COMCursor.index++).toString();
      this.name = this.option.name || null;
      this.isShadow = this.option.isShadow || false;
      return;
    }

    COMCursor.prototype.destroy = function() {
      var ref;
      this.isDestroyed = true;
      if ((ref = this.anchor) != null) {
        if (typeof ref.deactivate === "function") {
          ref.deactivate();
        }
      }
      this.target = null;
      this.emit("destroyed");
      return true;
    };

    COMCursor.prototype.getPath = function() {
      var path;
      if (!this.anchor) {
        return null;
      }
      path = this.anchor.node.getPath();
      path.anchor = this.anchor.toJSON();
      return path;
    };

    COMCursor.prototype.getCurrentPath = function() {
      var path;
      if (!this.target) {
        return null;
      }
      path = new COMPath(this.target);
      return path;
    };

    COMCursor.prototype.toJSON = function() {
      var json;
      if (!this.target) {
        return null;
      }
      json = {
        path: this.getCurrentPath().toJSON() || null,
        anchor: this.anchor.toJSON()
      };
      return json;
    };

    COMCursor.prototype.setByJSON = function(json) {
      if (json == null) {
        json = {};
      }
      return this.setByPath(new COMPath(json.path) || [], json.anchor || null);
    };

    COMCursor.prototype.setByPath = function(path, anchor) {
      var child;
      if (!path) {
        return false;
      }
      child = this.context.root.getChildByPath(path);
      return this.pointAt(child, {
        anchor: anchor
      });
    };

    COMCursor.prototype.setCursorByDOMRegion = function(region) {
      var com, lastPointable, node, offset, target;
      node = region.node;
      offset = region.index;
      if (node instanceof Text) {
        target = node.parentElement;
      } else {
        target = node;
      }
      while (target && target !== this.context.root.el) {
        if (!target.com) {
          target = target.parentElement;
          continue;
        }
        com = target.com;
        break;
      }
      if (!com) {
        return false;
      }
      lastPointable = null;
      while (com.parent) {
        if (com.anchor) {
          lastPointable = com;
          break;
        }
        com = com.parent;
      }
      if (!lastPointable) {
        return false;
      }
      this.setByPath(lastPointable.getPath());
      this.anchor.setByDOM(node, offset);
      return true;
    };

    COMCursor.prototype.clone = function() {
      var cursor;
      cursor = this.context.createCursor();
      cursor.pointAtAnchor(this.anchor);
      return cursor;
    };

    COMCursor.prototype.getData = function() {
      return {
        context: this.context,
        anchor: this.anchor.clone()
      };
    };

    COMCursor.prototype.fromData = function(data) {
      this.pointAtAnchor(data.anchor);
      return this;
    };

    COMCursor.prototype.equal = function(cursor) {
      var ref;
      return cursor.context === this.context && ((ref = cursor.anchor) != null ? ref.equal(this.anchor) : void 0);
    };

    return COMCursor;

  })(EventEmitter);

  TrapableTrait = (function(superClass) {
    extend(TrapableTrait, superClass);

    function TrapableTrait() {
      return TrapableTrait.__super__.constructor.apply(this, arguments);
    }

    TrapableTrait.prototype.getTrapTop = function(target) {
      var node;
      node = target || this.target;
      while (node && !node.trapPolicy) {
        node = node.parent;
      }
      if (node && node.trapPolicy) {
        return node;
      }
      return null;
    };

    TrapableTrait.prototype.trapIn = function(node, option) {
      var action, current, method;
      if (!node.trapPolicy || node.trapPolicy.trap === "ignore") {
        return false;
      }
      current = this.getTrapTop();
      if (current && !current.contains(node)) {
        Logger.error("invalid trap inhirency");
        return false;
      }
      this.walkerRootFirst.setTop(node);
      if (node.anchor) {
        if (option.direction === "left") {
          action = "head";
        } else {
          action = "tail";
        }
        this.pointAt(node, {
          actions: [action]
        });
        return true;
      }
      this.walkerRootFirst.setNode(node);
      if (option.direction === "left") {
        method = "next";
        action = "head";
      } else {
        method = "previous";
        action = "tail";
      }
      if (this.walkerRootFirst[method](function(item) {
        return item.anchor;
      })) {
        this.pointAt(this.walkerRootFirst.node, {
          actions: [action]
        });
        return true;
      }
      this.pointAt(node.parent, {
        trapTarget: node,
        trapOutDirection: option.direction
      });
      return false;
    };

    return TrapableTrait;

  })(Trait);

  Teleportable = (function(superClass) {
    extend(Teleportable, superClass);

    function Teleportable() {
      return Teleportable.__super__.constructor.apply(this, arguments);
    }

    Teleportable.prototype.teleportStartAnchor = null;

    Teleportable.prototype.startTeleport = function() {
      if (!this.anchor) {
        return;
      }
      this.isTeleporting = true;
      return this.teleportStartAnchor = this.anchor.clone();
    };

    Teleportable.prototype.endTeleport = function() {
      if (!this.teleportStartAnchor) {
        return;
      }
      this.isTeleporting = false;
      if (!this.teleportStartAnchor.equal(this.anchor)) {
        this.emit("move");
      }
      return this.teleportStartAnchor = null;
    };

    return Teleportable;

  })(Trait);

  PointableTrait = (function(superClass) {
    extend(PointableTrait, superClass);

    function PointableTrait() {
      return PointableTrait.__super__.constructor.apply(this, arguments);
    }

    PointableTrait.prototype.rev = 0;

    PointableTrait.prototype.initialize = function() {
      return this.__defineGetter__("version", (function(_this) {
        return function() {
          var ref;
          return _this.rev + ":" + (((ref = _this.anchor) != null ? ref.rev : void 0) || "");
        };
      })(this));
    };

    PointableTrait.prototype.pointAtRune = function(rune) {
      var anchor, parent, ref;
      if (!rune) {
        return false;
      }
      parent = rune.parent;
      anchor = (ref = parent.anchor) != null ? ref.clone() : void 0;
      if (!anchor) {
        return false;
      }
      anchor.pointAt(rune);
      return this.pointAtAnchor(anchor);
    };

    PointableTrait.prototype.pointAtAnchor = function(anchor) {
      return this.pointAt(anchor.node, {
        anchor: anchor.toJSON()
      });
    };

    PointableTrait.prototype.pointAt = function(node, option) {
      var action, actionResult, i, len, ref, ref1, ref2, ref3, result, walker;
      if (option == null) {
        option = {};
      }
      if (node.context !== this.context) {
        throw new Error("can't point at node not belongs to cursor.context");
      }
      if (this.isDestroyed) {
        throw new Error("the cursor is already destroyed");
      }
      if (!node.anchor) {
        if (option.trapTarget) {
          Logger.error("trap out to a non pointable node", node);
          return false;
        }
        walker = new WalkerRootFirst(this.context);
        walker.setTop(node);
        walker.setNode(node);
        result = walker.next(function(item) {
          return item.anchor;
        });
        if (!result) {
          Logger.error("can't point to target", node, "without anchor");
          return false;
        }
        node = walker.node;
        if (option.anchor) {
          Logger.error("indirect point at, ignore anchor option");
          option.anchor = null;
        }
      }
      this.walkerRootFirst.setTop(this.getTrapTop(node));
      if ((ref = this.anchor) != null) {
        ref.deactivate({
          replacementCursor: this,
          replacementAnchor: node.anchor
        });
      }
      if (this.anchor) {
        this.anchor.stopListenBy(this);
      }
      this.target = node;
      this.anchor = this.target.anchor.clone();
      if (option.index) {
        this.anchor.index = option.index;
      }
      if ((ref1 = this.anchor) != null) {
        ref1.listenBy(this, "move", (function(_this) {
          return function() {
            if (_this.isTeleporting) {
              return;
            }
            return _this.emit("move");
          };
        })(this));
      }
      if ((ref2 = this.anchor) != null) {
        ref2.activate(this);
      }
      if (option.anchor) {
        this.anchor.fromJSON(option.anchor);
      }
      if (option.trapTarget) {
        this.anchor.trapRecover(option.trapTarget, option.trapOutDirection);
      }
      if (option.actions) {
        ref3 = option.actions;
        for (i = 0, len = ref3.length; i < len; i++) {
          action = ref3[i];
          if (typeof action === "string") {
            actionResult = this.conduct(action);
          } else {
            actionResult = this.conduct(action.name, action.value);
          }
        }
      }
      if (!this.isTeleporting) {
        this.emit("move");
      }
      this.rev += 1;
      if (typeof actionResult === "boolean") {
        return actionResult;
      }
      return true;
    };

    return PointableTrait;

  })(Trait);

  WalkableTrait = (function(superClass) {
    extend(WalkableTrait, superClass);

    function WalkableTrait() {
      return WalkableTrait.__super__.constructor.apply(this, arguments);
    }

    WalkableTrait.prototype.initialize = function() {
      this.walkerRootFirst = new WalkerRootFirst(this.context);
      return this.walker = new Walker(this.context);
    };

    WalkableTrait.prototype.begin = function() {
      var has;
      this.walkerRootFirst.setNode(this.context.root);
      has = this.walkerRootFirst.next(function(node) {
        return node.anchor;
      });
      if (!has) {
        return false;
      }
      return this.pointAt(this.walkerRootFirst.node, {
        actions: ["head"]
      });
    };

    WalkableTrait.prototype.end = function() {
      var has;
      this.walkerRootFirst.setNode(this.context.root);
      has = this.walkerRootFirst.previous(function(node) {
        return node.anchor;
      });
      if (!has) {
        return false;
      }
      return this.pointAt(this.walkerRootFirst.node, {
        actions: ["tail"]
      });
    };

    WalkableTrait.prototype.next = function(option) {
      var top;
      this.walkerRootFirst.setNode(this.target);
      this.walkerRootFirst.skipChildOnce = true;
      if (this.walkerRootFirst.next(function(node) {
        return node.anchor;
      })) {
        this.walkerRootFirst.skipChildOnce = false;
        return this.pointAt(this.walkerRootFirst.node, option);
      }
      top = this.getTrapTop(this.target);
      if (top) {
        this.walkerRootFirst.setTop(this.getTrapTop(top.parent) || null);
        if (option == null) {
          option = {};
        }
        option.actions = [];
        option.trapOutDirection = "right";
        option.trapTarget = top;
        return this.pointAt(top.parent, option);
      }
      return false;
    };

    WalkableTrait.prototype.previous = function(option) {
      var top;
      this.walkerRootFirst.setNode(this.target);
      this.walkerRootFirst.skipChildOnce = true;
      if (this.walkerRootFirst.previous(function(node) {
        return node.anchor;
      })) {
        this.walkerRootFirst.skipChildOnce = false;
        return this.pointAt(this.walkerRootFirst.node, option);
      }
      top = this.getTrapTop();
      if (top) {
        this.walkerRootFirst.setTop(this.getTrapTop(top.parent) || null);
        if (option == null) {
          option = {};
        }
        option.actions = [];
        option.trapOutDirection = "left";
        option.trapTarget = top;
        return this.pointAt(top.parent, option);
      }
      return false;
    };

    return WalkableTrait;

  })(Trait);

  CaretUISuggesterTrait = (function(superClass) {
    extend(CaretUISuggesterTrait, superClass);

    function CaretUISuggesterTrait() {
      return CaretUISuggesterTrait.__super__.constructor.apply(this, arguments);
    }

    CaretUISuggesterTrait.prototype.getBoundary = function() {
      var boundary, ref;
      boundary = ((ref = this.anchor) != null ? ref.getCorrespondingBoundary() : void 0) || null;
      return boundary;
    };

    CaretUISuggesterTrait.prototype.getVisualPosition = function() {
      var ref;
      return ((ref = this.anchor) != null ? ref.getVisualPosition() : void 0) || null;
    };

    CaretUISuggesterTrait.prototype.getStyle = function() {
      var ref;
      return ((ref = this.anchor) != null ? ref.getCaretStyle() : void 0) || null;
    };

    return CaretUISuggesterTrait;

  })(Trait);

  InputSuggesterTrait = (function(superClass) {
    extend(InputSuggesterTrait, superClass);

    function InputSuggesterTrait() {
      return InputSuggesterTrait.__super__.constructor.apply(this, arguments);
    }

    InputSuggesterTrait.prototype.getSurroundingText = function(count) {
      var ref;
      return ((ref = this.anchor) != null ? typeof ref.getSurroundingText === "function" ? ref.getSurroundingText(count) : void 0 : void 0) || {
        before: "",
        after: ""
      };
    };

    InputSuggesterTrait.prototype.getSurroundingWord = function(count) {
      var ref;
      return ((ref = this.anchor) != null ? ref.getSurroundingWord(count) : void 0) || {
        before: "",
        after: ""
      };
    };

    InputSuggesterTrait.prototype.matchingBeforeText = function(string) {
      var ref;
      return (ref = this.anchor) != null ? ref.matchingBeforeText(string) : void 0;
    };

    InputSuggesterTrait.prototype.IMEReplace = function(before, after) {
      var value;
      if (this.context.isReadonly) {
        this.context.emit("editAttemp");
        return false;
      }
      value = false;
      this.context.transact((function(_this) {
        return function() {
          var ref;
          return value = (ref = _this.anchor) != null ? ref.IMEReplace(before, after) : void 0;
        };
      })(this));
      return value;
    };

    return InputSuggesterTrait;

  })(Trait);

  ConductableTrait = (function(superClass) {
    extend(ConductableTrait, superClass);

    function ConductableTrait() {
      return ConductableTrait.__super__.constructor.apply(this, arguments);
    }

    ConductableTrait.prototype.initialize = function() {
      this.state = new COMCursorState(this);
      this.actions = new CursorActions(this);
      return this.commands = new CursorCommands(this);
    };

    ConductableTrait.prototype.conduct = function() {
      var args, ref, ref1, result;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      result = (ref = this.actions).conduct.apply(ref, args);
      if (result) {
        return true;
      }
      return (ref1 = this.commands).exec.apply(ref1, args);
    };

    return ConductableTrait;

  })(Trait);

  CursorActions = (function() {
    function CursorActions(cursor1) {
      this.cursor = cursor1;
      this.defaultPolicy = new COMTravelPolicy();
    }

    CursorActions.prototype.conduct = function(name, value) {
      var anchor, isEditAction, policy, result, target;
      if (name.toLowerCase().indexOf("delete") >= 0) {
        isEditAction = true;
      }
      if (isEditAction) {
        this.cursor.captureIdenticalCursors();
      }
      target = this.cursor.target;
      anchor = this.cursor.anchor;
      if (!name) {
        return false;
      }
      if (!target) {
        return false;
      }
      if (typeof this[name] !== "function") {
        return false;
      }
      if (!anchor) {
        return false;
      }
      policy = target.travelPolicy || this.defaultPolicy;
      if ((!anchor[name] && !this[name]) || policy[name] === "ignore") {
        return false;
      }
      result = this[name](target, anchor, policy, value);
      if (isEditAction) {
        this.cursor.transportIdenticalCursors();
      }
      return result;
    };

    CursorActions.prototype.previous = function() {
      var args, ref;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref = this.cursor).previous.apply(ref, args);
    };

    CursorActions.prototype.next = function() {
      var args, ref;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref = this.cursor).next.apply(ref, args);
    };

    CursorActions.prototype.nextRune = function(target, anchor, policy, option) {
      var result;
      if (option == null) {
        option = {};
      }
      result = anchor.nextRune(option);
      if (result) {
        return true;
      }
      this.cursor.state.save();
      if (this.next({
        actions: [
          "head", {
            name: "nextRune",
            value: {
              fresh: true
            }
          }
        ]
      })) {
        this.cursor.state.discard();
        return true;
      } else {
        this.cursor.state.restore();
        return false;
      }
    };

    CursorActions.prototype.previousRune = function(target, anchor, policy, option) {
      var result;
      result = anchor.previousRune(option);
      if (result) {
        return true;
      }
      this.cursor.state.save();
      if (this.previous({
        actions: [
          "tail", {
            name: "previousRune",
            value: {
              fresh: true
            }
          }
        ]
      })) {
        this.cursor.state.discard();
        return true;
      } else {
        this.cursor.state.restore();
        return false;
      }
    };

    CursorActions.prototype.forwardChar = function(target, anchor, policy) {
      var result;
      result = anchor.forwardChar();
      if (result) {
        if (anchor.isTail() && policy.tailBoundary === "pass") {
          this.next({
            actions: ["head"]
          });
        }
        return true;
      }
      if (anchor.isTail() && policy.tailBoundary === "pass") {
        return this.next({
          actions: ["head"]
        });
      }
      if (policy.forwardBypassed === "handover") {
        return this.next({
          actions: ["head", "forwardChar"]
        });
      } else if (policy.forwardBypassed === "bypass") {
        return this.next({
          actions: ["head"]
        });
      } else {
        return false;
      }
    };

    CursorActions.prototype.applyTailBoundary = function(target, anchor, policy) {
      if (anchor.isTail() && policy.tailBoundary === "pass") {
        this.next({
          actions: ["head", "applyTailBoundary"]
        });
        return true;
      }
      return false;
    };

    CursorActions.prototype.backwardChar = function(target, anchor, policy) {
      var result;
      result = anchor.backwardChar();
      if (result) {
        return true;
      }
      if (policy.backwardBypassed === "handover") {
        return this.previous({
          actions: ["tail", "backwardChar"]
        });
      } else if (policy.backwardBypassed === "bypass") {
        return this.previous({
          actions: ["tail"]
        });
      } else {
        return false;
      }
    };

    CursorActions.prototype.upwardChar = function(target, anchor, policy) {
      return anchor.upwardChar();
    };

    CursorActions.prototype.downwardChar = function(target, anchor, policy) {
      return anchor.downwardChar();
    };

    CursorActions.prototype.forwardWord = function(target, anchor, policy) {
      var result;
      result = anchor.forwardWord();
      if (result) {
        if (anchor.isTail() && policy.tailBoundary === "pass") {
          this.next({
            actions: ["head"]
          });
        }
        return true;
      }
      if (policy.forwardBypassed === "handover") {
        return this.next({
          actions: ["head", "forwardWord"]
        });
      } else if (policy.forwardBypassed === "bypass") {
        return this.next({
          actions: ["head"]
        });
      }
    };

    CursorActions.prototype.backwardWord = function(target, anchor, policy) {
      var result;
      result = anchor.backwardWord();
      if (result) {
        return true;
      }
      if (policy.backwardBypassed === "handover") {
        return this.previous({
          actions: ["tail", "backwardWord"]
        });
      } else if (policy.backwardBypassed === "bypass") {
        return this.previous({
          actions: ["tail"]
        });
      }
    };

    CursorActions.prototype.deleteWord = function(target, anchor, policy) {
      var result;
      result = anchor.backwardWord();
      if (result) {
        return true;
      }
      if (policy.backwardBypassed === "handover") {
        return this.previous({
          actions: ["tail", "backwardWord"]
        });
      } else if (policy.backwardBypassed === "bypass") {
        return this.previous({
          actions: ["tail"]
        });
      }
    };

    CursorActions.prototype.head = function(target, anchor, policy) {
      return anchor.head();
    };

    CursorActions.prototype.tail = function(target, anchor, policy) {
      return anchor.tail();
    };

    CursorActions.prototype.deleteLineBeforeCursor = function(target, anchor, policy, option) {
      var result;
      result = typeof anchor.deleteLineBeforeAnchor === "function" ? anchor.deleteLineBeforeAnchor() : void 0;
      if (result) {
        return true;
      }
      if (policy.deleteBypassed === "handover") {
        return this.previous({
          actions: ["tail", "deleteLineBeforeCursor"]
        });
      } else if (policy.deleteBypassed === "bypass") {
        return this.previous({
          actions: ["tail", "deleteLineBeforeCursor"]
        });
      } else if (policy.deleteBypassed === "merge") {
        if (!this.previous({
          actions: ["tail"]
        })) {
          return false;
        }
        if (this.cursor.target.mergeContentString && target.toContentString) {
          this.cursor.target.mergeContentString(target.toContentString(), target);
          target.remove();
        }
        return false;
      }
      return false;
    };

    CursorActions.prototype.deleteChar = function(target, anchor, policy) {
      var result;
      result = anchor.deleteChar();
      if (result) {
        return true;
      }
      if (policy.deleteBypassed === "handover") {
        return this.previous({
          actions: ["tail", "deleteChar"]
        });
      } else if (policy.deleteBypassed === "bypass") {
        return this.previous({
          actions: ["tail", "deleteChar"]
        });
      } else if (policy.deleteBypassed === "merge") {
        if (!this.previous({
          actions: ["tail"]
        })) {
          return false;
        }
        if (this.cursor.target.mergeContentString && target.toContentString) {
          this.cursor.target.mergeContentString(target.toContentString(), target);
          target.remove();
        }
        return false;
      }
      return false;
    };

    CursorActions.prototype.startOfLine = function(target, anchor, policy) {
      var result;
      result = typeof anchor.startOfLine === "function" ? anchor.startOfLine() : void 0;
      if (result) {
        return true;
      }
      if (policy.startOfLine === "boundary") {
        anchor.index = 0;
        return true;
      }
      if (policy.startOfLine === "handover") {
        if (this.previous({
          actions: ["tail", "startOfLine"]
        })) {
          return true;
        } else {
          return this.cursor.begin();
        }
      }
      return false;
    };

    CursorActions.prototype.endOfLine = function(target, anchor, policy) {
      var result;
      result = typeof anchor.endOfLine === "function" ? anchor.endOfLine() : void 0;
      if (result) {
        return true;
      }
      if (policy.endOfLine === "boundary") {
        anchor.index = target.length;
        return true;
      }
      if (policy.endOfLine === "handover") {
        if (this.next({
          actions: ["endOfLine"]
        })) {
          return true;
        } else {
          return this.cursor.end();
        }
      }
      return false;
    };

    CursorActions.prototype.deleteWord = function(target, anchor, policy) {
      var result;
      result = anchor.deleteWord();
      if (result) {
        return true;
      }
      if (policy.deleteBypassed === "handover") {
        return this.previous({
          actions: ["tail", "deleteWord"]
        });
      } else if (policy.deleteBypassed === "bypass") {
        return this.previous({
          actions: ["tail", "deleteWord"]
        });
      } else if (policy.deleteBypassed === "merge") {
        if (!this.previous({
          actions: ["tail"]
        })) {
          return false;
        }
        if (this.cursor.target.mergeContentString && target.toContentString) {
          this.cursor.target.mergeContentString(target.toContentString(), target);
          target.remove();
        }
        return false;
      }
      return false;
    };

    CursorActions.prototype.trigger = function() {
      var anchor, args, policy, result, target;
      target = arguments[0], anchor = arguments[1], policy = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      result = anchor.trigger.apply(anchor, args);
      if (result) {
        this.cursor.emit("trigger");
      }
      return result;
    };

    CursorActions.prototype.write = function(target, anchor, policy, value) {
      return anchor.write(value);
    };

    return CursorActions;

  })();

  CursorCommands = (function() {
    function CursorCommands(cursor1) {
      this.cursor = cursor1;
    }

    CursorCommands.prototype.exec = function() {
      var name, node, params;
      name = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (!this.cursor.target) {
        return false;
      }
      node = this.cursor.target;
      while (node) {
        if (typeof node.exec === "function" ? node.exec.apply(node, [name].concat(slice.call(params))) : void 0) {
          return true;
        }
        node = node.parent;
      }
      return false;
    };

    return CursorCommands;

  })();

  COMCursorState = (function() {
    function COMCursorState(cursor1) {
      this.cursor = cursor1;
      this.states = [];
    }

    COMCursorState.prototype.save = function() {
      return this.states.push(this.cursor.clone());
    };

    COMCursorState.prototype.discard = function() {
      var cursor;
      cursor = this.states.pop();
      return cursor.destroy();
    };

    COMCursorState.prototype.restore = function() {
      var cursor;
      cursor = this.states.pop();
      if (cursor && cursor.anchor) {
        this.cursor.pointAtAnchor(cursor.anchor);
      }
      return cursor.destroy();
    };

    return COMCursorState;

  })();

  IdenticalCursorTrasportable = (function(superClass) {
    extend(IdenticalCursorTrasportable, superClass);

    function IdenticalCursorTrasportable() {
      return IdenticalCursorTrasportable.__super__.constructor.apply(this, arguments);
    }

    IdenticalCursorTrasportable.prototype.friendCursors = null;

    IdenticalCursorTrasportable.prototype.initialize = function() {
      return this.friendCursors = [];
    };

    IdenticalCursorTrasportable.prototype.captureIdenticalCursors = function() {
      var cursor, id, ref;
      this.friendCursors.length = 0;
      ref = this.context.cursors;
      for (id in ref) {
        cursor = ref[id];
        if (cursor !== this && cursor.equal(this)) {
          this.friendCursors.push(cursor);
        }
      }
      return true;
    };

    IdenticalCursorTrasportable.prototype.transportIdenticalCursors = function() {
      var cursor, i, len, ref;
      ref = this.friendCursors;
      for (i = 0, len = ref.length; i < len; i++) {
        cursor = ref[i];
        cursor.pointAtAnchor(this.anchor);
      }
      return this.friendCursors.length = 0;
    };

    return IdenticalCursorTrasportable;

  })(Trait);

  module.exports = COMCursor;

}).call(this);
