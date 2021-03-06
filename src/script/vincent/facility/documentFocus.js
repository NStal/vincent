// Generated by CoffeeScript 1.10.0
(function() {
  var DocumentFocus, EventEmitter, FocusManager,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  EventEmitter = (require("../common/events")).EventEmitter;

  DocumentFocus = (function(superClass) {
    extend(DocumentFocus, superClass);

    function DocumentFocus(name) {
      this.name = name;
      DocumentFocus.__super__.constructor.call(this);
      this.usedBy = [];
    }

    DocumentFocus.prototype.isAvailable = function() {
      return this.usedBy.length === 0;
    };

    DocumentFocus.prototype.obtain = function(who) {
      var length;
      length = this.usedBy.length;
      if (indexOf.call(this.usedBy, who) < 0) {
        this.usedBy.push(who);
      }
      if (length === 0) {
        return this.emit("change");
      }
    };

    DocumentFocus.prototype.release = function(who) {
      var length;
      length = this.usedBy.length;
      this.usedBy = this.usedBy.filter(function(item) {
        return item !== who;
      });
      if (this.usedBy.length === 0 && length !== 0) {
        return this.emit("change");
      }
    };

    return DocumentFocus;

  })(EventEmitter);

  FocusManager = (function(superClass) {
    extend(FocusManager, superClass);

    function FocusManager(editor) {
      var focuses, i, item, len;
      this.editor = editor;
      this.inputFocus = new DocumentFocus("input");
      this.bufferFocus = new DocumentFocus("buffer");
      this.editorFocus = new DocumentFocus("editor");
      focuses = [this.inputFocus, this.bufferFocus, this.editorFocus];
      for (i = 0, len = focuses.length; i < len; i++) {
        item = focuses[i];
        item.listenBy(this, "change", (function(_this) {
          return function() {
            return _this.apply();
          };
        })(this));
      }
    }

    FocusManager.prototype.debug = function() {
      return Logger.debug("focus input:" + (this.inputFocus.isAvailable()) + ",buffer:" + (this.bufferFocus.isAvailable()) + ",editor:" + (this.editorFocus.isAvailable()) + ",");
    };

    FocusManager.prototype.apply = function() {
      if (!this.editorFocus.isAvailable()) {
        return this.disableAll();
      } else if (!this.bufferFocus.isAvailable()) {
        return this.toEditorLevel();
      } else if (!this.inputFocus.isAvailable()) {
        return this.toBufferLevel();
      } else {
        return this.allowAll();
      }
    };

    FocusManager.prototype.allowAll = function() {
      this.editor.inputMethod.obtainDocumentFocus();
      this.editor.inputMethod.activate();
      this.editor.domSelection.enable();
      this.editor.clipboard.enable();
      this.editor.activate();
      this.editor.hotkeys.enableAll();
      return this.level = "all";
    };

    FocusManager.prototype.toBufferLevel = function() {
      this.editor.inputMethod.releaseDocumentFocus();
      this.editor.inputMethod.activate();
      this.editor.domSelection.enable();
      this.editor.clipboard.enable();
      this.editor.activate();
      this.editor.hotkeys.enableAll();
      this.editor.hotkeys.disableInput();
      return this.level = "buffer";
    };

    FocusManager.prototype.toEditorLevel = function() {
      this.editor.inputMethod.releaseDocumentFocus();
      this.editor.inputMethod.activate();
      this.editor.clipboard.disable();
      this.editor.activate();
      this.editor.domSelection.disable();
      this.editor.hotkeys.enableAll();
      this.editor.hotkeys.disableInput();
      this.editor.hotkeys.disableBuffer();
      return this.level = "editor";
    };

    FocusManager.prototype.disableAll = function() {
      this.editor.inputMethod.deactivate();
      this.editor.clipboard.disable();
      this.editor.domSelection.disable();
      this.editor.hotkeys.disableInput();
      this.editor.hotkeys.disableBuffer();
      this.editor.hotkeys.disableEditor();
      return this.level = "none";
    };

    return FocusManager;

  })(EventEmitter);

  DocumentFocus.FocusManager = FocusManager;

  module.exports = DocumentFocus;

}).call(this);
