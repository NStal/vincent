// Generated by CoffeeScript 1.10.0
(function() {
  var COMDecoration, COMOperation, COMRichText, COMSpell, CollapseListContentOperation, ExpandListContentOperation, ListHeadHighlight, ListHeadReg, ListHeadRegG, ListItem, ListItemHeadSpell,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice1 = [].slice;

  COMSpell = COM.COMSpell;

  COMRichText = COM.COMRichText;

  COMDecoration = COM.COMDecoration;

  COMOperation = COM.COMOperation;

  ListItemHeadSpell = (function(superClass) {
    var ListItemHeadView, reg;

    extend(ListItemHeadSpell, superClass);

    ListItemHeadView = (function(superClass1) {
      extend(ListItemHeadView, superClass1);

      function ListItemHeadView(renderContext, listItem1) {
        var ref, ref1, ref2;
        this.renderContext = renderContext;
        this.listItem = listItem1;
        this.template = "<span data-class=\"active\" class=\"com-inline-list-head\"><span data-id=\"texts\" class=\"texts\"></span><div class=\"list-item-menu-trigger print-not\"><i class=\"fa fa-ellipsis-h\"></i></div><div class='gtd-indicator'><div class=\"i-todo\"></div><div class=\"i-done\"></div><div class=\"i-pending\"></div><div class=\"i-cancel\"></div></div></span>";
        ListItemHeadView.__super__.constructor.call(this);
        this.sm = (ref = this.listItem) != null ? (ref1 = ref.context) != null ? (ref2 = ref1.editor) != null ? typeof ref2.plugin === "function" ? ref2.plugin("SillyMenu") : void 0 : void 0 : void 0 : void 0;
        this.buffer = this.renderContext.buffer;
        this.node.addEventListener("touchstart", this.onMousedownNode.bind(this));
      }

      ListItemHeadView.prototype.onMousedownNode = function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return this.showMenu();
      };

      ListItemHeadView.prototype.showMenu = function() {
        if (!this.sm) {
          return;
        }
        if (this.buffer.cursor.target !== this.listItem) {
          this.buffer.cursor.pointAt(this.listItem);
          this.buffer.editor.conduct("start-of-list-item");
        }
        this.VM.active = true;
        return this.sm.prompts(this.getListMenuOptions(this.listItem, this.buffer), this.node, {
          callback: (function(_this) {
            return function() {
              return _this.VM.active = false;
            };
          })(this)
        });
      };

      ListItemHeadView.prototype.getListMenuOptions = function(listItem, buffer) {
        var cursor, editor, i, item, len, next, options, ref, ref1, ref2, ref3, ref4, todo;
        options = [];
        cursor = buffer.cursor;
        editor = buffer.editor;
        if (listItem.isCollapsed) {
          options.push({
            content: "Expand",
            icon: "fa-ellipsis-v",
            title: "{cmd:force-trigger} or {cmd:expand-list-item}: Expand the list",
            callback: (function(_this) {
              return function() {
                return listItem.context.transact(function() {
                  if (cursor.target !== listItem) {
                    cursor.pointAt(listItem);
                  }
                  return editor.conduct("expand-list-item");
                });
              };
            })(this)
          });
        } else {
          next = listItem.next();
          if (next && next.sortOf("ListItem") && next.getIndentLevel() > listItem.getIndentLevel()) {
            options.push({
              content: "Collapse",
              icon: "fa-ellipsis-h",
              title: "{cmd:force-trigger} or {cmd:collapse-list-item}: Collapse the list",
              callback: (function(_this) {
                return function() {
                  return listItem.context.transact(function() {
                    if (cursor.target !== listItem) {
                      cursor.pointAt(listItem);
                    }
                    return editor.conduct("collapse-list-item");
                  });
                };
              })(this)
            });
          }
        }
        options.push({
          content: "Delete",
          title: "{cmd:remove-current-list}: Remove the list",
          icon: "fa-remove",
          callback: (function(_this) {
            return function() {
              return listItem.context.transact(function() {
                if (cursor.target !== listItem) {
                  cursor.pointAt(listItem);
                }
                return editor.conduct("remove-current-list");
              });
            };
          })(this)
        });
        todo = null;
        ref = listItem.children;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          if (item.type === "Todo") {
            todo = item;
            break;
          }
        }
        if (todo) {
          options.push({
            content: "Toggle todo",
            icon: "fa-check-square-o",
            title: "{cmd:mark-list-todo-next} or {cmd:mark-list-todo-previous}: Change todo state",
            callback: (function(_this) {
              return function() {
                listItem.context.transact(function() {});
                if (cursor.target !== listItem) {
                  cursor.pointAt(listItem);
                  editor.conduct("start-of-list-item");
                }
                return editor.conduct("mark-list-todo-next");
              };
            })(this)
          });
        } else {
          options.push({
            content: "Todo",
            icon: "fa-check-square-o",
            title: "{cmd:mark-list-todo}: Mark list as todo",
            callback: (function(_this) {
              return function() {
                listItem.context.transact(function() {});
                if (cursor.target !== listItem) {
                  cursor.pointAt(listItem);
                  editor.conduct("start-of-list-item");
                }
                return editor.conduct("mark-list-todo");
              };
            })(this)
          });
        }
        options.push({
          content: "Forward",
          icon: "fa-indent",
          title: "{cmd:indent-forward}: Indent the list forward",
          callback: (function(_this) {
            return function() {
              return listItem.context.transact(function() {
                if (cursor.target !== listItem) {
                  cursor.pointAt(listItem);
                }
                return editor.conduct("indent-forward");
              });
            };
          })(this)
        });
        options.push({
          content: "Backward",
          icon: "fa-outdent",
          title: "{cmd:indent-backward}: Indent the list backward",
          callback: (function(_this) {
            return function() {
              return listItem.context.transact(function() {
                if (cursor.target !== listItem) {
                  cursor.pointAt(listItem);
                }
                return editor.conduct("indent-backward");
              });
            };
          })(this)
        });
        if (!editor.platform.isMobile()) {
          options.push({
            content: "Caret to begin",
            icon: "fa-i-cursor",
            title: "{cmd:start-of-list-item}: Move caret to start of the list item",
            callback: (function(_this) {
              return function() {
                return listItem.context.transact(function() {
                  if (cursor.target !== listItem) {
                    cursor.pointAt(listItem);
                  }
                  return editor.conduct("start-of-list-item");
                });
              };
            })(this)
          });
        }
        if ((ref1 = listItem.previous()) != null ? ref1.sortOf("ListItem") : void 0) {
          options.push({
            content: "Move to top",
            title: "{cmd:move-current-list-item-to-block-begin}: Move current list to top",
            icon: "fa-long-arrow-up",
            callback: (function(_this) {
              return function() {
                return listItem.context.transact(function() {
                  if (cursor.target !== listItem) {
                    cursor.pointAt(listItem);
                  }
                  editor.conduct("start-of-list-item");
                  return editor.conduct("move-current-list-item-to-block-begin");
                });
              };
            })(this)
          });
          options.push({
            content: "Swap up",
            title: "{cmd:list-item-swap-up}: Swap the current list with the previous one",
            icon: "fa-angle-up",
            callback: (function(_this) {
              return function() {
                return listItem.context.transact(function() {
                  if (cursor.target !== listItem) {
                    cursor.pointAt(listItem);
                  }
                  editor.conduct("start-of-list-item");
                  return editor.conduct("list-item-swap-up");
                });
              };
            })(this)
          });
        }
        if ((ref2 = listItem.next()) != null ? ref2.sortOf("ListItem") : void 0) {
          options.push({
            content: "Swap down",
            icon: "fa-angle-down",
            title: "{cmd:list-item-swap-down}: Swap the current list with the next one",
            callback: (function(_this) {
              return function() {
                return listItem.context.transact(function() {
                  if (cursor.target !== listItem) {
                    cursor.pointAt(listItem);
                  }
                  editor.conduct("start-of-list-item");
                  return editor.conduct("list-item-swap-down");
                });
              };
            })(this)
          });
          options.push({
            content: "Move to bottom",
            title: "{cmd:move-current-list-item-to-block-begin}: Move current list to bottom",
            icon: "fa-long-arrow-down",
            callback: (function(_this) {
              return function() {
                return listItem.context.transact(function() {
                  if (cursor.target !== listItem) {
                    cursor.pointAt(listItem);
                  }
                  editor.conduct("start-of-list-item");
                  return editor.conduct("move-current-list-item-to-block-end");
                });
              };
            })(this)
          });
        }
        options.push({
          content: "Clear finished",
          title: "{cmd:clear-all-done-or-cancel-list-at-current-level}: Remove list that is marked as done or cancel only at current list level",
          icon: "fa-list-ul",
          callback: (function(_this) {
            return function() {
              if (cursor.target !== listItem) {
                cursor.pointAt(listItem);
              }
              editor.conduct("start-of-list-item");
              return editor.conduct("clear-all-done-or-cancel-list-at-current-level");
            };
          })(this)
        });
        if (((ref3 = cursor.context.metas.gtdOverview) != null ? ref3.done : void 0) > 0 || ((ref4 = cursor.context.metas.gtdOverview) != null ? ref4.cancel : void 0) > 0) {
          options.push({
            content: "Clear all finished",
            title: "{cmd:clear-all-done-or-cancel-list}: Remove all list in the document that is marked as done or cancel",
            icon: "fa-list",
            callback: (function(_this) {
              return function() {
                return editor.conduct("clear-all-done-or-cancel-list");
              };
            })(this)
          });
        }
        return options;
      };

      return ListItemHeadView;

    })(Leaf.Widget);

    reg = /^\s*(-|\*|\+|[0-9]+(\.|\)|、)) /;

    function ListItemHeadSpell() {
      var args;
      args = 1 <= arguments.length ? slice1.call(arguments, 0) : [];
      if (this.appearance == null) {
        this.appearance = {
          tagName: "span",
          classList: ["com", "com-inline-list-head", "com-text"]
        };
      }
      ListItemHeadSpell.__super__.constructor.apply(this, args);
      this.noTriggerFocus = true;
    }

    ListItemHeadSpell.prototype.onRootAvailable = function() {
      ListItemHeadSpell.__super__.onRootAvailable.call(this);
      return this.parent.head = this;
    };

    ListItemHeadSpell.prototype.type = "ListItemHeadSpell";

    ListItemHeadSpell.prototype.specifyTextContainer = function() {
      return this.cache.view.UI.texts;
    };

    ListItemHeadSpell.prototype.customBaseRender = function() {
      var base;
      if ((base = this.cache).view == null) {
        base.view = new ListItemHeadView(this.rc, this.parent);
      }
      this.cache.view.UI.texts.innerHTML = "";
      return this.el = this.cache.view.node;
    };

    ListItemHeadSpell.prototype.render = function() {
      var args;
      args = 1 <= arguments.length ? slice1.call(arguments, 0) : [];
      return ListItemHeadSpell.__super__.render.apply(this, args);
    };

    ListItemHeadSpell.prototype.trigger = function() {
      var ref;
      return (ref = this.cache.view) != null ? ref.showMenu() : void 0;
    };

    ListItemHeadSpell.prototype.test = function(contentString, index, completeString) {
      var match;
      if (contentString == null) {
        contentString = "";
      }
      if (typeof index === "number" && index !== 0) {
        return null;
      }
      match = contentString.match(reg);
      if (match) {
        return {
          start: match.index,
          end: match.index + match[0].length,
          match: match
        };
      }
      return null;
    };

    ListItemHeadSpell.prototype.compose = function() {
      var match, myIndex, ref;
      match = this.contentString.match(reg);
      myIndex = this.parent.indexOf(this);
      if (!match || match.index !== 0 || match[0].length !== this.length || myIndex !== 0) {
        this.toNormalTextInPlace();
        this.dirty = true;
        if ((ref = this.parent) != null) {
          ref.dirty = true;
        }
        return true;
      }
      return false;
    };

    return ListItemHeadSpell;

  })(COMSpell);

  ListItem = (function(superClass) {
    extend(ListItem, superClass);

    ListItem.preferedUnorderedPrefix = "*";

    ListItem.isContentMatchListItem = function(content) {
      return /^( *)(?:-|\*|\+|[0-9]+(\.|\)|、)) +.*\n?$/.test(content);
    };

    ListItem.isContentMatchListItemHeader = function(content) {
      return /^( *)(?:-|\*|\+|[0-9]+(\.|\)|、)) +\n?$/.test(content);
    };

    ListItem.prototype.type = "ListItem";

    ListItem.prototype.onRootAvailable = function() {
      ListItem.__super__.onRootAvailable.call(this);
      return this.pend();
    };

    ListItem.prototype.isSingleLine = true;

    function ListItem(context, data) {
      var i, item, len, ref, ref1, ref2, ref3;
      this.context = context;
      this.data = data != null ? data : {};
      this.appearance = {
        tagName: "span",
        classList: ["com", "com-rich-text", "com-list-item", "com-el-single-line"]
      };
      this.privateSpells = [ListItemHeadSpell];
      ListItem.__super__.constructor.call(this, this.context, this.data);
      if (this.spacePerIndent == null) {
        this.spacePerIndent = 4;
      }
      this.registerCommand("indentForward", (function(_this) {
        return function() {
          var current, max;
          max = _this.guessMaxIndent();
          current = _this.getIndentLevel();
          if (current < max) {
            _this.setIndentLevel(current + 1);
          } else {
            _this.setIndentLevel(0);
          }
          return true;
        };
      })(this));
      this.registerCommand("indentBackward", (function(_this) {
        return function() {
          var current;
          current = _this.getIndentLevel();
          if (current > 0) {
            _this.setIndentLevel(current - 1);
          } else {
            _this.setIndentLevel(0);
          }
          return true;
        };
      })(this));
      this.isCollapsed = false;
      this.collapseListItems = [];
      if (this.data.collapseListItems && this.data.collapseListItems.length > 0) {
        ref = this.data.collapseListItems;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          this.collapseListItems.push(this.context.createElement(item));
        }
        this.isCollapsed = true;
        this.collapseIndent = this.data.collapseIndent || 0;
      }
      this.composePolicy.behave({
        borrow: true,
        lend: false,
        tailingNewline: true
      });
      this.layout = "block";
      if (((ref1 = this.getHead()) != null ? ref1.indexOf("*") : void 0) >= 0) {
        ListItem.preferedUnorderedPrefix = "*";
      } else if (((ref2 = this.getHead()) != null ? ref2.indexOf("-") : void 0) >= 0) {
        ListItem.preferedUnorderedPrefix = "-";
      } else if (((ref3 = this.getHead()) != null ? ref3.indexOf("+") : void 0) >= 0) {
        ListItem.preferedUnorderedPrefix = "+";
      }
      this.headerClickCheck = this.headerClickCheck.bind(this);
      this.gtd = this.data.gtd || {};
      return this;
    }

    ListItem.prototype.getTodoType = function() {
      var todos;
      todos = this.filterRunes(function(item) {
        return item.sortOf("Todo");
      });
      if (todos.length === 0) {
        return null;
      }
      return todos[0].state;
    };

    ListItem.prototype.isEmpty = function() {
      return this.contentString.trim().indexOf(" ") < 0;
    };

    ListItem.prototype.anchorAtBeginText = function() {
      var anchor, ref;
      anchor = this.anchor.clone();
      anchor.index = ((ref = this.getHead()) != null ? ref.length : void 0) || 0;
      return anchor;
    };

    ListItem.prototype.trigger = function(option) {
      if (option == null) {
        option = {};
      }
      if (!option.force && option.via !== "tap" && option.via !== "holder") {
        return false;
      }
      if (this.isCollapsed) {
        return this.expand();
      } else {
        return this.collapse();
      }
      return false;
    };

    ListItem.prototype.collapse = function() {
      var anchor, cursor, cursorToSave, i, indent, item, items, j, k, len, len1, len2, next, ref, tail, target, todoType;
      if (this.isCollapsed) {
        return false;
      }
      target = this;
      items = [];
      indent = this.getIndentLevel();
      while (true) {
        next = target.next();
        if (next && next.sortOf("ListItem") && next.getIndentLevel() > indent) {
          items.push(next);
          target = next;
          continue;
        }
        break;
      }
      if (items.length === 0) {
        return false;
      }
      this.context.operate(new CollapseListContentOperation(this.context, this, {
        items: items,
        indent: indent
      }));
      cursorToSave = [];
      this.gtd = {
        todo: 0,
        done: 0,
        cancel: 0,
        pending: 0
      };
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        todoType = item.getTodoType();
        if (todoType) {
          this.gtd[todoType] += 1;
        }
        ref = item.anchors || [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          anchor = ref[j];
          if (anchor.cursor) {
            cursorToSave.push(anchor.cursor);
          }
        }
        item.remove();
      }
      tail = this.anchor.clone();
      tail.endOfLine();
      for (k = 0, len2 = cursorToSave.length; k < len2; k++) {
        cursor = cursorToSave[k];
        cursor.pointAtAnchor(tail);
      }
      return true;
    };

    ListItem.prototype.getOrderIndex = function() {
      if (this.listType === "list") {
        return -1;
      }
      return parseInt(this.getHeadPrefix());
    };

    ListItem.prototype.getPrefixDecorator = function() {
      var ref;
      return (ref = this.getHead()) != null ? ref.replace(/[0-9]+/g, "").trim() : void 0;
    };

    ListItem.prototype.expand = function() {
      var change, i, indent, item, items, j, len, len1;
      if (!this.isCollapsed) {
        return false;
      }
      items = this.collapseListItems.slice();
      items.reverse();
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        this.after(item);
      }
      indent = this.getIndentLevel();
      if (indent !== this.collapseIndent) {
        change = indent - this.collapseIndent;
        for (j = 0, len1 = items.length; j < len1; j++) {
          item = items[j];
          item.setIndentLevel(item.getIndentLevel() + change);
        }
      }
      this.gtd = {};
      this.context.operate(new ExpandListContentOperation(this.context, this, {}));
      return true;
    };

    ListItem.prototype.getSubList = function() {
      var indent, items, next;
      items = [];
      next = this;
      indent = this.getIndentLevel();
      while (next = next.next()) {
        if (!next.sortOf("ListItem")) {
          return items;
        }
        if (next.getIndentLevel() > indent) {
          items.push(next);
        } else {
          return items;
        }
      }
      return items;
    };

    ListItem.prototype.getNextUpperLevel = function() {
      var indent, next;
      next = this;
      indent = this.getIndentLevel();
      while (next = next.next()) {
        if (!next.sortOf("ListItem")) {
          return null;
        }
        if (next.getIndentLevel() <= indent) {
          return next;
        }
      }
      return null;
    };

    ListItem.prototype.getPreviousUpperLevel = function() {
      var indent, previous;
      previous = this;
      indent = this.getIndentLevel();
      while (previous = previous.previous()) {
        if (!previous.sortOf("ListItem")) {
          return null;
        }
        if (previous.getIndentLevel() <= indent) {
          return previous;
        }
      }
      return null;
    };

    ListItem.prototype.toContentString = function(option) {
      var after, cs, i, item, len, ref;
      cs = ListItem.__super__.toContentString.call(this, option);
      if (!this.isCollapsed || cs === "") {
        return cs;
      }
      after = "";
      ref = this.collapseListItems;
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        after += item.toContentString(option);
      }
      return cs + after;
    };

    ListItem.prototype.render = function(rc) {
      var classList, i, item, j, len, len1, prop, ref;
      if (this.isCollapsed) {
        this.forceHolder = true;
        this.placeholder = "...";
      } else {
        this.forceHolder = false;
        this.placeholder = "";
      }
      ListItem.__super__.render.call(this, rc);
      classList = (function() {
        var i, len, ref, results1;
        ref = this.el.classList;
        results1 = [];
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          results1.push(item);
        }
        return results1;
      }).call(this);
      for (i = 0, len = classList.length; i < len; i++) {
        item = classList[i];
        if (item.indexOf("com-list-item-indent-space") === 0) {
          this.el.classList.remove(item);
        }
        if (item.indexOf("gtd-inside") === 0) {
          this.el.classList.remove(item);
        }
      }
      this.el.classList.add("com-list-item-indent-space-" + (this.getIndentLevel() * this.spacePerIndent));
      if (this.isCollapsed) {
        this.el.classList.add("collapsed");
        ref = ["todo", "done", "pending", "cancel"];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          prop = ref[j];
          if (this.gtd[prop] > 0) {
            this.el.classList.add("gtd-inside-" + prop);
          }
        }
      } else {
        this.el.classList.remove("collapsed");
      }
      this.el.removeEventListener("mousedown", this.headerClickCheck);
      this.el.addEventListener("mousedown", this.headerClickCheck);
      return true;
    };

    ListItem.prototype.headerClickCheck = function(e) {
      var ref, src;
      src = e.target || e.srcElement;
      if (src != null ? (ref = src.classList) != null ? ref.contains("com-inline-list-head") : void 0 : void 0) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return this.context.transact((function(_this) {
          return function() {
            if (_this.isCollapsed) {
              return _this.expand();
            } else {
              return _this.collapse();
            }
          };
        })(this));
      }
    };

    ListItem.prototype.clone = function() {
      var item, result;
      result = ListItem.__super__.clone.call(this);
      if (!result) {
        return result;
      }
      if (this.isCollapsed) {
        result.isCollapsed = this.isCollapsed;
        result.collapseListItems = (function() {
          var i, len, ref, results1;
          ref = this.collapseListItems;
          results1 = [];
          for (i = 0, len = ref.length; i < len; i++) {
            item = ref[i];
            results1.push(item.clone());
          }
          return results1;
        }).call(this);
        result.collapseIndent = this.collapseIndent;
      }
      return result;
    };

    ListItem.prototype.slice = function(option) {
      var slice;
      slice = ListItem.__super__.slice.call(this, option);
      if (!slice) {
        return null;
      }
      if (slice.isPartial && !slice.looseComplete) {
        return slice;
      }
      return this.clone();
    };

    ListItem.prototype.toHumanString = function() {
      var i, item, len, ref, result;
      result = [ListItem.__super__.toHumanString.call(this)];
      if (this.isCollapsed) {
        ref = this.collapseListItems;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          result.push(item.toHumanString());
        }
      }
      return result.join("");
    };

    ListItem.prototype.toJSON = function(option) {
      var i, item, json, len, ref, results;
      json = ListItem.__super__.toJSON.call(this, option);
      if (!json) {
        return null;
      }
      if (this.isCollapsed) {
        json.isCollapsed = true;
        results = [];
        ref = this.collapseListItems;
        for (i = 0, len = ref.length; i < len; i++) {
          item = ref[i];
          results.push(item.toJSON());
        }
        json.collapseListItems = results;
        json.collapseIndent = this.collapseIndent;
        json.gtd = {
          todo: this.gtd.todo || 0,
          pending: this.gtd.pending || 0,
          done: this.gtd.done || 0,
          cancel: this.gtd.cancel || 0
        };
      }
      return json;
    };

    ListItem.prototype.getHead = function() {
      var contentString, index;
      contentString = this.contentString;
      index = 0;
      while (contentString[index] === " ") {
        index += 1;
      }
      while (contentString[index] !== " ") {
        index += 1;
      }
      return contentString.slice(0, index);
    };

    ListItem.prototype.getType = function() {
      this.updateType();
      return this.listType;
    };

    ListItem.prototype.updateType = function() {
      var head, ref;
      head = ((ref = this.getHead()) != null ? ref.trim() : void 0) || "";
      if (head === "*") {
        return this.listType = "list";
      } else if (head === "-") {
        return this.listType = "list";
      } else if (head === "+") {
        return this.listType = "list";
      } else if (/[0-9]+(\.|\)|、)/.test(head)) {
        return this.listType = "order";
      } else {
        return this.listType = "list";
      }
    };

    ListItem.prototype.getHeadPrefix = function() {
      return this.getHead().trim();
    };

    ListItem.prototype.toggleOrderType = function() {
      if (this.getType() === "list") {
        return this.toOrdered();
      } else {
        return this.toUnordered();
      }
    };

    ListItem.prototype.toOrdered = function() {
      return this.setHeadPrefix("1.");
    };

    ListItem.prototype.toUnordered = function() {
      return this.setHeadPrefix(ListItem.preferedUnorderedPrefix || "-");
    };

    ListItem.prototype.setHeadPrefix = function(prefix) {
      var head, oldHead, space;
      if (prefix == null) {
        prefix = "";
      }
      prefix = prefix.trim();
      if (!prefix) {
        return false;
      }
      space = this.getIndentSpace();
      head = "" + space + prefix + " ";
      oldHead = this.getHead();
      this.insertText(oldHead.length, head);
      this.removeText(0, oldHead.length);
      return true;
    };

    ListItem.prototype.getHead = function() {
      var match;
      match = this.contentString.match(ListHeadReg);
      if (!match) {
        return "";
      }
      return match[0];
    };

    ListItem.prototype.guessMaxIndent = function() {
      return this.guessPreviousIndentLevel() + 1;
    };

    ListItem.prototype.guessPreviousIndentLevel = function() {
      var previous, recursive;
      recursive = 2;
      previous = this.previous();
      while (previous && recursive > 0) {
        recursive -= 1;
        if (previous instanceof ListItem) {
          return previous.getIndentLevel();
        }
        previous = previous.previous();
      }
      return 0;
    };

    ListItem.prototype.getIndentSpace = function() {
      var content, index;
      content = this.contentString;
      index = 0;
      while (content[index] === " ") {
        index++;
      }
      return content.slice(0, index);
    };

    ListItem.prototype.getIndentLevel = function() {
      var content, index;
      content = this.contentString;
      index = 0;
      while (content[index] === " ") {
        index++;
      }
      return Math.floor(index / this.spacePerIndent);
    };

    ListItem.prototype.setIndentLevel = function(level) {
      var _, content, currentLength, editIndex, i, index, previousLength, ref, spaces, toAdd;
      if (level < 0) {
        level = 0;
      }
      level = parseInt(level) || 0;
      content = this.contentString;
      previousLength = content.length;
      editIndex = this.anchor.index || 0;
      index = 0;
      while (content[index] === " ") {
        index++;
      }
      toAdd = level * this.spacePerIndent - index;
      if (toAdd > 0) {
        spaces = "";
        for (_ = i = 0, ref = toAdd; 0 <= ref ? i < ref : i > ref; _ = 0 <= ref ? ++i : --i) {
          spaces += " ";
        }
        this.insertText(0, spaces);
      } else if (toAdd < 0) {
        this.removeText(0, -toAdd);
      }
      currentLength = this.contentString.length;
      editIndex -= previousLength - currentLength;
      if (editIndex < 0) {
        editIndex = 0;
      }
      if (this.anchor.isActive) {
        return this.anchor.index = editIndex;
      }
    };

    return ListItem;

  })(COMRichText);

  ListHeadReg = /^\s*(-|\*|\+|[0-9]+(\.|\)|、)) /;

  ListHeadRegG = /^\s*(-|\*|\+|[0-9]+(\.|\)|、)) /g;

  ListHeadHighlight = COMDecoration.createRegExpMaintainer("ListHead", ListHeadRegG, ["com-inline-list-head"]);

  CollapseListContentOperation = (function(superClass) {
    extend(CollapseListContentOperation, superClass);

    function CollapseListContentOperation() {
      return CollapseListContentOperation.__super__.constructor.apply(this, arguments);
    }

    CollapseListContentOperation.prototype.name = "CollapseListContentOperation";

    CollapseListContentOperation.prototype.invoke = function() {
      this.target.collapseIndent = this.option.indent;
      this.target.collapseListItems = this.option.items || [];
      this.target.isCollapsed = true;
      this.target.dirty = true;
      return true;
    };

    CollapseListContentOperation.prototype.revoke = function() {
      this.target.collapseIndent = 0;
      this.target.collapseListItems = [];
      this.target.isCollapsed = false;
      this.target.dirty = true;
      return true;
    };

    return CollapseListContentOperation;

  })(COMOperation.EditOperation);

  ExpandListContentOperation = (function(superClass) {
    extend(ExpandListContentOperation, superClass);

    function ExpandListContentOperation() {
      return ExpandListContentOperation.__super__.constructor.apply(this, arguments);
    }

    ExpandListContentOperation.prototype.name = "ExpandListContentOperation";

    ExpandListContentOperation.prototype.invoke = function() {
      this.option.indent = this.target.collapseIndent;
      this.option.items = this.target.collapseListItems.slice();
      this.target.isCollapsed = false;
      this.target.collapseListItems = [];
      this.target.dirty = true;
      this.target.collapseIndent = 0;
      return true;
    };

    ExpandListContentOperation.prototype.revoke = function() {
      this.target.isCollapsed = true;
      this.target.collapseListItems = this.option.items.slice();
      this.target.collapseIndent = this.option.indent;
      this.target.dirty = true;
      return true;
    };

    return ExpandListContentOperation;

  })(COMOperation.EditOperation);

  module.exports = ListItem;

}).call(this);
