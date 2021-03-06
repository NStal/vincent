// Generated by CoffeeScript 1.10.0
(function() {
  var Debounce,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Debounce = (function(superClass) {
    extend(Debounce, superClass);

    Debounce.debounce = function(time, method) {
      var db, option;
      if (time == null) {
        time = 0;
      }
      if (typeof time === "number") {
        option = {
          time: time
        };
      } else {
        option = time;
      }
      db = new Debounce(option, method);
      return db.trigger.bind(db);
    };

    function Debounce(option, handler) {
      if (option == null) {
        option = {};
      }
      this.handler = handler != null ? handler : function() {};
      Debounce.__super__.constructor.call(this);
      this.time = option.time || 1000;
      this.max = option.max || null;
      this.reset();
    }

    Debounce.prototype.setHandler = function(handler) {
      this.handler = handler;
    };

    Debounce.prototype.trigger = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      this.triggerArgs = args;
      if (!this.firstTriggerDate && this.max) {
        this.firstTriggerDate = Date.now();
        clearTimeout(this.maxTimer);
        this.maxTimer = setTimeout((function(_this) {
          return function() {
            clearTimeout(_this.timer);
            _this.firstTriggerDate = null;
            _this.handler.apply(_this, _this.triggerArgs);
            return _this.triggerArgs = [];
          };
        })(this), this.max);
      }
      clearTimeout(this.timer);
      this.timer = setTimeout((function(_this) {
        return function() {
          clearTimeout(_this.maxTimer);
          _this.maxTimer = null;
          _this.firstTriggerDate = null;
          _this.handler.apply(_this, _this.triggerArgs);
          return _this.triggerArgs = [];
        };
      })(this), this.time);
      return this;
    };

    Debounce.prototype.cancel = function() {
      return this.reset();
    };

    Debounce.prototype.reset = function() {
      clearTimeout(this.timer);
      clearTimeout(this.maxTimer);
      this.firstTriggerDate = null;
      return this.triggerArgs = [];
    };

    return Debounce;

  })(Leaf.EventEmitter);

  module.exports = Debounce;

}).call(this);
