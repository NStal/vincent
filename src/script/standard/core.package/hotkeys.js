// Generated by CoffeeScript 1.10.0
(function() {
  var addKey, hotkeys;

  hotkeys = [];

  addKey = function(key, command) {
    return hotkeys.push([key, command]);
  };

  addKey("buffer:tab", "indent-forward");

  addKey("buffer:swipeRight", "indent-forward");

  addKey("buffer:<shift> tab", "indent-backward");

  addKey("buffer:swipeLeft", "indent-backward");

  addKey("buffer:<alt> enter", "make-list-item");

  addKey("buffer:enter", "make-next-list-item");

  addKey("buffer:tab", "indent-region-forward");

  addKey("buffer:swipeRight", "indent-region-forward");

  addKey("buffer:<shift>tab", "indent-region-backward");

  addKey("buffer:swipeLeft", "indent-region-backward");

  addKey("buffer:<alt> up", "list-item-swap-up");

  addKey("buffer:<alt> down", "list-item-swap-down");

  addKey("buffer:<alt> <shift> down", "list-block-swap-down");

  addKey("buffer:<alt> <shift> up", "list-block-swap-up");

  addKey("buffer:<alt> up", "list-region-swap-up");

  addKey("buffer:<alt> down", "list-region-swap-down");

  addKey("buffer:<alt> p", "collapse-list-item");

  addKey("buffer:<ctrl><alt> openBracket", "collapse-list-item");

  addKey("buffer:<alt> p", "expand-list-item");

  addKey("buffer:<ctrl><alt> closeBracket", "expand-list-item");

  addKey("buffer:<mod><shift> up", "list-item-collapse-or-goto-parent");

  addKey("buffer:<mod><shift> down", "expand-list-item-or-tail");

  addKey("buffer:<alt> home", "void");

  addKey("buffer:<alt> home", "start-of-list-item");

  addKey("buffer:<alt> home", "start-of-headline");

  addKey({
    osx: "<ctrl><alt> a"
  }, "start-of-list-item");

  addKey({
    osx: "<ctrl><alt> a"
  }, "start-of-headline");

  addKey("buffer:<mod><alt> backspace", "remove-current-list");

  addKey("buffer:<mod><alt> backspace", "remove-region-list");

  addKey("buffer:<alt> o", "toggle-list-item-type");

  addKey("buffer:<alt> o", "toggle-list-item-type-in-region");

  addKey("buffer:<alt> period", "move-current-list-item-to-block-end");

  addKey("buffer:<alt> comma", "move-current-list-item-to-block-begin");

  addKey("buffer:<alt> period", "move-current-list-region-to-block-end");

  addKey("buffer:<alt> comma", "move-current-list-region-to-block-begin");

  addKey("buffer:<alt><shift> 6", "merge-current-line-with-previous");

  addKey("buffer:<alt> up", "swap-current-line-with-previous");

  addKey("buffer:<alt> down", "swap-current-line-with-next");

  module.exports = hotkeys;

}).call(this);
