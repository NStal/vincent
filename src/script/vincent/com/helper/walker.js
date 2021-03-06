// Generated by CoffeeScript 1.10.0
(function() {
  var Walker, WalkerRootFirst;

  Walker = (function() {
    function Walker(context) {
      this.context = context;
      this.MAX = 1000 * 100;
      this.top = this.context.root;
      this.node = this.context.root;
    }

    Walker.prototype.setTop = function(top) {
      this.top = top;
    };

    Walker.prototype.setNode = function(node1) {
      this.node = node1;
    };

    Walker.prototype.stepIn = function() {
      var ref;
      if ((ref = this.node.children) != null ? ref[0] : void 0) {
        this.node = this.node.children[0];
        return true;
      }
      return false;
    };

    Walker.prototype.stepOver = function() {
      var node;
      node = this.node.next();
      if (node) {
        this.node = node;
        return true;
      }
      return false;
    };

    Walker.prototype.stepBack = function() {
      var node;
      node = this.node.previous();
      if (node) {
        this.node = node;
        return true;
      }
      return false;
    };

    Walker.prototype.stepOut = function() {
      if (this.top && this.node === this.top) {
        return false;
      }
      if (this.node.parent) {
        this.node = this.node.parent;
        return true;
      }
      return false;
    };

    return Walker;

  })();

  WalkerRootFirst = (function() {
    function WalkerRootFirst(context) {
      this.context = context;
      this.MAX = 1000 * 100;
      this.top = this.context.root;
    }

    WalkerRootFirst.prototype.isTop = function() {
      return this.node.isRoot;
    };

    WalkerRootFirst.prototype.setNode = function(node1) {
      this.node = node1;
    };

    WalkerRootFirst.prototype.setTop = function(top) {
      this.top = top;
    };

    WalkerRootFirst.prototype.next = function(judge) {
      var counter, next, node, parent, pnext;
      if (judge == null) {
        judge = function() {
          return true;
        };
      }
      counter = 0;
      while (true) {
        counter++;
        if (counter > this.MAX) {
          throw new Error("like to be recursive walking! walked node exceed max " + this.MAX);
        }
        if (this.node.children && this.node.children.length > 0 && this.node.child && !this.skipChildOnce) {
          this.node = this.node.child(0);
          if (judge(this.node)) {
            return true;
          }
          continue;
        }
        this.skipChildOnce = false;
        if (this.top && this.node === this.top) {
          this.skipBrotherOnce = false;
          return false;
        }
        next = this.node.next();
        if (next && !this.skipBrotherOnce) {
          this.node = next;
          if (judge(this.node)) {
            return true;
          }
          continue;
        }
        this.skipBrotherOnce = false;
        node = this.node;
        while (true) {
          parent = node.parent;
          if (!parent || parent === this.top) {
            return false;
          }
          pnext = parent.next();
          if (pnext) {
            this.node = pnext;
            if (judge(this.node)) {
              return true;
            }
            break;
          }
          node = parent;
        }
        continue;
      }
    };

    WalkerRootFirst.prototype.previous = function(judge) {
      var node, parent, pprevious, previous;
      if (judge == null) {
        judge = function() {
          return true;
        };
      }
      while (true) {
        if (this.node.children && this.node.children.length > 0 && this.node.last() && !this.skipChildOnce) {
          this.node = this.node.last();
          if (judge(this.node)) {
            return true;
          }
          continue;
        }
        this.skipChildOnce = false;
        if (this.top && this.node === this.top) {
          this.skipBrotherOnce = false;
          return false;
        }
        previous = this.node.previous();
        if (previous && !this.skipBrotherOnce) {
          this.node = previous;
          if (judge(this.node)) {
            return true;
          }
          continue;
        }
        this.skipBrotherOnce = false;
        node = this.node;
        while (true) {
          parent = node.parent;
          if (!parent || parent === this.top) {
            return false;
          }
          pprevious = parent.previous();
          if (pprevious) {
            this.node = pprevious;
            if (judge(this.node)) {
              return true;
            }
            break;
          }
          node = parent;
        }
        continue;
      }
    };

    WalkerRootFirst.prototype.last = function(judge) {
      if (judge == null) {
        judge = function() {
          return true;
        };
      }
      this.setNode(this.top || this.context.root);
      return this.previous(judge);
    };

    WalkerRootFirst.prototype.first = function(judge) {
      if (judge == null) {
        judge = function() {
          return true;
        };
      }
      this.setNode(this.top || this.context.root);
      return this.next(judge);
    };

    return WalkerRootFirst;

  })();

  module.exports = Walker;

  module.exports.WalkerRootFirst = WalkerRootFirst;

}).call(this);
