// Generated by CoffeeScript 1.10.0
(function() {
  var HTMLTag;

  HTMLTag = (function() {
    function HTMLTag(name, children, props) {
      this.name = name;
      this.children = children;
      this.props = props;
      if (typeof this.children === "string") {
        this.name = "TEXT";
        this.text = this.children;
        this.children = null;
        this.props = null;
      } else {
        this.name = this.name.toLowerCase();
      }
    }

    HTMLTag.prototype.isText = function() {
      return this.name === "TEXT";
    };

    HTMLTag.prototype.addChild = function(child) {
      if (this.children instanceof Array) {
        this.children.push(child);
        return child.parent = this;
      } else {
        return Logger.error("Can add child to Text element");
      }
    };

    return HTMLTag;

  })();

  module.exports = HTMLTag;

}).call(this);