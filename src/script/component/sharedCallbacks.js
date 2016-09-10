// Generated by CoffeeScript 1.10.0
(function() {
  var slice = [].slice;

  module.exports.create = (function(_this) {
    return function() {
      var fn;
      fn = function() {
        var args, callback, cbs, i, len, results;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        cbs = fn.callbacks.slice(0);
        fn.callbacks.length = 0;
        results = [];
        for (i = 0, len = cbs.length; i < len; i++) {
          callback = cbs[i];
          results.push(callback.apply(null, args));
        }
        return results;
      };
      fn.callbacks = [];
      fn.__defineGetter__("length", function() {
        return fn.callbacks.length;
      });
      fn.__defineGetter__("count", function() {
        return fn.callbacks.length;
      });
      fn.push = function(callback) {
        if (typeof callback !== "function") {
          Logger.warn("SharedCallback.push with none function", callback);
          return false;
        }
        return this.callbacks.push(callback);
      };
      fn.clear = function() {
        return fn.callbacks.length = 0;
      };
      return fn;
    };
  })(this);

}).call(this);
