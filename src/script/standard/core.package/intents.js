// Generated by CoffeeScript 1.10.0
(function() {
  var COMIntent, GalleryIntent, OpenIntent, RenderIntent,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  COMIntent = COM.COMIntent;

  OpenIntent = (function(superClass) {
    extend(OpenIntent, superClass);

    OpenIntent.prototype.name = "OpenIntent";

    function OpenIntent(context, uri, arg) {
      this.context = context;
      arg;
      OpenIntent.__super__.constructor.call(this, this.context, "OpenIntent", {
        uri: uri
      });
    }

    return OpenIntent;

  })(COMIntent);

  GalleryIntent = (function(superClass) {
    extend(GalleryIntent, superClass);

    GalleryIntent.prototype.name = "GalleryIntent";

    function GalleryIntent(context, arg) {
      var offset, srcs;
      this.context = context;
      srcs = arg.srcs, offset = arg.offset;
      GalleryIntent.__super__.constructor.call(this, this.context, "GalleryIntent", {
        srcs: srcs,
        offset: offset
      });
    }

    return GalleryIntent;

  })(COMIntent);

  RenderIntent = (function(superClass) {
    extend(RenderIntent, superClass);

    RenderIntent.prototype.name = "RenderIntent";

    function RenderIntent(context) {
      this.context = context;
      RenderIntent.__super__.constructor.call(this, this.context, "RenderIntent");
    }

    return RenderIntent;

  })(COMIntent);

  module.exports = [OpenIntent, GalleryIntent, RenderIntent];

}).call(this);
