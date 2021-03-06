// Generated by CoffeeScript 1.10.0
(function() {
  var Caret, Rect, SelectionHighlight,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Caret = require("./caret");

  SelectionHighlight = (function(superClass) {
    extend(SelectionHighlight, superClass);

    function SelectionHighlight(buffer) {
      this.buffer = buffer;
      this.editor = this.buffer.editor;
      this.buffer.listenBy(this, "resize", (function(_this) {
        return function() {
          return _this.render();
        };
      })(this));
      this.caretBase = new Caret(this.editor, {
        name: "base"
      });
      this.caretExtent = new Caret(this.editor, {
        name: "extent"
      });
      this.caretBase.init();
      this.caretExtent.init();
      this.head = new Rect();
      this.body = new Rect();
      this.foot = new Rect();
      this.buffer.viewPort.el.appendChild(this.head.node);
      this.buffer.viewPort.el.appendChild(this.body.node);
      this.buffer.viewPort.el.appendChild(this.foot.node);
    }

    SelectionHighlight.prototype.destroy = function() {
      this.caretBase.destroy();
      this.caretExtent.destroy();
      return this.buffer.stopListenBy(this);
    };

    SelectionHighlight.prototype.setRange = function(range) {
      this.range = range;
      return this.render();
    };

    SelectionHighlight.prototype.render = function() {
      if (this.buffer.selection.isCollapsed() || !this.buffer.selection.isActive) {
        this.caretBase.hide();
        this.caretExtent.hide();
        this.head.setDimension();
        this.body.setDimension();
        this.foot.setDimension();
        return;
      }
      if (!this.caretBase.isShow) {
        this.caretBase.show();
        this.caretExtent.show();
        if (this.caretBase.currentBuffer !== this.buffer) {
          this.caretBase.attachTo(this.buffer, this.buffer.selection.baseCursor);
          this.caretExtent.attachTo(this.buffer, this.buffer.selection.extentCursor);
        }
      }
      this.caretBase.update();
      this.caretExtent.update();
      return this.updateRects();
    };

    SelectionHighlight.prototype.updateRects = function() {
      var bottomRect, rootRect, topRect;
      rootRect = this.buffer.viewPort.el.getBoundingClientRect();
      topRect = this.caretBase.lastRenderDetail;
      bottomRect = this.caretExtent.lastRenderDetail;
      if (!topRect || !bottomRect) {
        return;
      }
      if (topRect.bottom < bottomRect.top) {
        return this.updateMultiLine(rootRect, topRect, bottomRect);
      } else if (bottomRect.bottom < topRect.top) {
        return this.updateMultiLine(rootRect, bottomRect, topRect);
      } else {
        if (topRect.left < bottomRect.left) {
          this.updateSingleLine(rootRect, topRect, bottomRect);
        } else {
          this.updateSingleLine(rootRect, bottomRect, topRect);
        }
      }
    };

    SelectionHighlight.prototype.updateSingleLine = function(rootRect, leftRect, rightRect) {
      var bottom, height, left, top, width;
      this.head.setDimension();
      this.foot.setDimension();
      top = Math.min(leftRect.top, rightRect.top);
      bottom = Math.max(leftRect.bottom, rightRect.bottom);
      height = bottom - top;
      left = leftRect.left;
      width = rightRect.right - leftRect.left;
      return this.body.setDimension({
        top: top,
        left: left,
        height: height,
        width: width
      });
    };

    SelectionHighlight.prototype.updateMultiLine = function(rootRect, topRect, bottomRect) {
      var bodyRect, footRect, headRect, scrollWidthFix;
      scrollWidthFix = 6;
      headRect = {
        left: topRect.left,
        top: topRect.top,
        width: rootRect.right - topRect.left - rootRect.left - scrollWidthFix,
        height: topRect.height
      };
      bodyRect = {
        left: 0,
        top: topRect.bottom,
        width: rootRect.width - scrollWidthFix,
        height: bottomRect.top - topRect.top - topRect.height
      };
      footRect = {
        left: 0,
        top: bottomRect.top,
        width: bottomRect.right,
        height: bottomRect.height
      };
      this.head.setDimension(headRect);
      this.body.setDimension(bodyRect);
      return this.foot.setDimension(footRect);
    };

    return SelectionHighlight;

  })(Leaf.EventEmitter);

  Rect = (function(superClass) {
    extend(Rect, superClass);

    function Rect() {
      Rect.__super__.constructor.call(this);
      this.node.classList.add("selection-rect");
    }

    Rect.prototype.setDimension = function(rect) {
      var prop, ref, ref1, value;
      if (!rect || rect.height <= 6) {
        this.node.style.display = "none";
        return;
      } else {
        this.node.style.display = "block";
      }
      if (((ref = this.lastRect) != null ? ref.left : void 0) === rect.left && ((ref1 = this.lastRect) != null ? ref1.top : void 0) === rect.top && this.lastRect.width === rect.width && this.lastRect.height === rect.height) {
        return;
      }
      this.lastRect = rect;
      for (prop in rect) {
        value = rect[prop];
        this.node.style[prop] = value + "px";
      }
      return this.node.style.position = "absolute";
    };

    return Rect;

  })(Leaf.Widget);

  module.exports = SelectionHighlight;

}).call(this);
