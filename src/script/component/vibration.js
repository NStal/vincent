// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = {
    vibrate: function(value) {
      var ref;
      return (ref = window.navigator) != null ? typeof ref.vibrate === "function" ? ref.vibrate(value) : void 0 : void 0;
    },
    feedback: function(value) {
      return this.vibrate(15);
    }
  };

}).call(this);
