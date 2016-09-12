// Generated by CoffeeScript 1.10.0
(function() {
  var COM, Vincent;

  if (typeof global !== "undefined") {
    global.Leaf = require("/lib/leaf");
    COM = require("/vincent/com/index");
    global.$ = require("/lib/jquery.min");
    global.COM = COM;
    if (!global.Logger) {
      global.Logger = console;
    }
  }

  if (typeof window !== "undefined") {
    window.Leaf = require("/lib/leaf");
    window.$ = require("/lib/jquery.min");
    COM = require("/vincent/com/index");
    window.COM = COM;
    if (!window.Logger) {
      window.Logger = console;
    }
  }

  Vincent = require("/vincent/index");

  module.exports = {
    Vincent: Vincent,
    COM: COM
  };

}).call(this);
