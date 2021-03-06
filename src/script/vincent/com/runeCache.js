// Generated by CoffeeScript 1.10.0
(function() {
  var COMRuneCache;

  COMRuneCache = (function() {
    function COMRuneCache(context) {
      var i, index, ref, zeros;
      this.context = context;
      this.cid = 0;
      this.cidWidth = 8;
      this.instances = {};
      this.prefixMap = {};
      zeros = "";
      for (index = i = 0, ref = this.cidWidth; 0 <= ref ? i < ref : i > ref; index = 0 <= ref ? ++i : --i) {
        this.prefixMap[index] = zeros;
        zeros += "0";
      }
      this.trashes = {};
    }

    COMRuneCache.prototype.release = function(rune) {
      if (!this.trashes[rune.cid]) {
        return this.trashes[rune.cid] = rune;
      }
    };

    COMRuneCache.prototype.reuse = function(rune) {
      delete this.trashes[rune.cid];
      if (!this.instances[rune.cid]) {
        return this.instances[rune.cid] = rune;
      }
    };

    COMRuneCache.prototype.gc = function() {
      var prop, ref, results, rune;
      ref = this.trashes;
      results = [];
      for (prop in ref) {
        rune = ref[prop];
        delete this.instances[rune.cid];
        results.push(delete this.trashes[rune.cid]);
      }
      return results;
    };

    COMRuneCache.prototype.allocate = function() {
      var append, id;
      id = this.cid++;
      id = id.toString();
      append = this.cidWidth - 2 - id.length;
      id = this.prefixMap[append] + id;
      return id;
    };

    COMRuneCache.prototype.assign = function(node) {
      if (typeof node.cid !== "number") {
        node.cid = this.allocate();
      }
      this.instances[node.cid] = node;
      return node.cid;
    };

    COMRuneCache.prototype.cloneByCid = function(cid) {
      var item;
      if (!this.instances[cid]) {
        return null;
      }
      item = this.instances[cid];
      return item.clone();
    };

    return COMRuneCache;

  })();

  module.exports = COMRuneCache;

}).call(this);
