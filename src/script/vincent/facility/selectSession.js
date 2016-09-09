// Generated by CoffeeScript 1.10.0
(function() {
  var DOMBoundary, DOMRegion, DOMSelection, SelectSession, States,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  States = require("../common/states");

  DOMRegion = require("../common/region");

  DOMBoundary = require("../common/boundary");

  DOMSelection = require("../facility/selection");

  SelectSession = (function(superClass) {
    extend(SelectSession, superClass);

    function SelectSession(buffer) {
      this.buffer = buffer;
      SelectSession.__super__.constructor.call(this);
      this.selection = this.buffer.selection;
      this.domSelection = this.buffer.editor.domSelection;
      this.onSelectionChange = this.onSelectionChange.bind(this);
      if (this.buffer.editor.platform.hasKeyboard() || true) {
        this.passive = false;
      } else {
        this.passive = true;
      }
      this.mode = "";
    }

    SelectSession.prototype.clear = function() {
      if (!this.passive) {
        this.clearDomSelection();
        this.selection.deactivate();
        return this.selection.collapseToEnd();
      }
    };

    SelectSession.prototype.syncSelection = function() {
      if (this.passive) {
        return;
      }
      return this.syncFromCOM();
    };

    SelectSession.prototype.selectCurrentWord = function() {
      var selection;
      selection = this.selection;
      selection.activate();
      selection.collapseToCursor();
      selection.baseCursor.conduct("backwardWord");
      return selection.extentCursor.conduct("forwardWord");
    };

    SelectSession.prototype.selectCurrentLine = function() {
      var selection;
      if (this.buffer.editor.platform.isMobile()) {
        return false;
      }
      selection = this.selection;
      selection.activate();
      selection.collapseToCursor();
      selection.baseCursor.conduct("startOfLine");
      return selection.extentCursor.conduct("endOfLine");
    };

    SelectSession.prototype.syncToCOM = function() {
      var base, extent, selection;
      selection = window.getSelection();
      if (selection.isCollapsed) {
        return false;
      }
      base = new DOMRegion(selection.baseNode, selection.baseOffset);
      extent = new DOMRegion(selection.extentNode, selection.extentOffset);
      this.selection.activate();
      this.selection.baseCursor.setCursorByDOMRegion(base);
      this.selection.extentCursor.setCursorByDOMRegion(extent);
      return true;
    };

    SelectSession.prototype.onSelectionChange = function() {
      if (this.passive) {
        return this.syncToCOM();
      }
    };

    SelectSession.prototype.deactivate = function() {
      this.clearDomSelection();
      if (!this.isActive) {
        return;
      }
      this.isActive = false;
      return document.removeEventListener("selectionchange", this.onSelectionChange);
    };

    SelectSession.prototype.activate = function() {
      if (this.isActive) {
        return;
      }
      this.isActive = true;
      return document.addEventListener("selectionchange", this.onSelectionChange);
    };

    SelectSession.prototype.syncFromCOM = function() {
      if (!this.isActive) {
        this.clearDomSelection();
        return false;
      }
      if (!this.selection.isActive) {
        this.clearDomSelection();
        return false;
      }
      if (this.passive) {
        return false;
      }
      if (this.selection.isCollapsed()) {
        this.clearDomSelection();
      } else {
        this.selectionFromCOM();
      }
      return true;
    };

    SelectSession.prototype.clearDomSelection = function() {
      return this.domSelection.clear(this);
    };

    SelectSession.prototype.updateExtentCursor = function(action) {
      if (action.source === "mouse") {
        return this.updateExtentCursorByMouse(action.e);
      } else {
        return this.updateExtentCursorByTouch(action.e);
      }
    };

    SelectSession.prototype.updateExtentCursorByTouch = function(e) {
      var ref, touches, x, y;
      if ((e != null ? (ref = e.touches) != null ? ref.length : void 0 : void 0) < 2) {
        return;
      }
      touches = e.touches;
      e.preventDefault();
      x = (touches[0].clientX + touches[1].clientX) / 2;
      y = (touches[0].clientY + touches[1].clientY) / 2;
      this.buffer.viewPort.setCursorByClientPoint(x, y);
      return this.selection.collapseToCursor();
    };

    SelectSession.prototype.updateExtentCursorByMouse = function(e) {
      return this.buffer.viewPort.setCursorByClientPoint(e.clientX, e.clientY);
    };

    SelectSession.prototype.selectionFromCOM = function() {
      var backup, base, extent, range, selection;
      selection = this.buffer.selection;
      if (!(base = selection.baseAnchor)) {
        return false;
      }
      if (!(extent = selection.extentAnchor)) {
        return false;
      }
      base = base.getCorrespondingBoundary();
      extent = extent.getCorrespondingBoundary();
      range = DOMBoundary.createRangeBetween(base, extent);
      backup = document.createRange();
      backup = range.cloneRange();
      backup.endOffset = 20;
      this.clearDomSelection();
      this.domSelection.use(this, range);
    };

    return SelectSession;

  })(States);

  module.exports = SelectSession;

}).call(this);