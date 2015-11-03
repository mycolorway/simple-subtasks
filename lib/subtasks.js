(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-subtasks', ["jquery","simple-module"], function (a0,b1) {
      return (root['subtasks'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['subtasks'] = factory(jQuery,SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Subtasks, subtasks,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Subtasks = (function(superClass) {
  extend(Subtasks, superClass);

  function Subtasks() {
    return Subtasks.__super__.constructor.apply(this, arguments);
  }

  Subtasks.prototype.opts = {
    el: null,
    cls: null,
    beforeRemove: null
  };

  Subtasks.prototype._tpl = "<ul class='simple-subtasks'>\n</ul>";

  Subtasks.prototype._taskTpl = "<li><input type='checkbox' /></li>";

  Subtasks.prototype._init = function() {
    if (!simple.checkbox) {
      throw new Error("simple-subtasks: simple.checkbox is required");
    }
    if (this.opts.el === null) {
      throw new Error("simple-subtasks: el option is invalid");
    }
    this.el = this.opts.el;
    this._render();
    return this._bind();
  };

  Subtasks.prototype._render = function() {
    this.subtasks = $(this._tpl).addClass(this.opts.cls);
    this.add_input = $("<li class='add task'><span>+</span><input type='text' autofocus='autofocus' placeholder='添加子任务'/></li>");
    this.subtasks.append(this.add_input);
    return this.el.data('subtasks', this.subtasks).html(this.subtasks);
  };

  Subtasks.prototype._renderCheckbox = function(el_array) {
    return el_array.each(function(index, el) {
      var $el;
      $el = $(el);
      return simple.checkbox({
        el: $el,
        size: $el.data('size'),
        animation: $el.data('animation')
      });
    });
  };

  Subtasks.prototype._bind = function() {
    return this.subtasks.on('checked', '.task .simple-checkbox', (function(_this) {
      return function(e) {
        return $(e.currentTarget).parent('li.task').addClass('complete');
      };
    })(this)).on('unchecked', '.task .simple-checkbox', (function(_this) {
      return function(e) {
        return $(e.currentTarget).parent('li.task').removeClass('complete');
      };
    })(this)).on('keyup', '.add.task input[type=text]', (function(_this) {
      return function(e) {
        var $li, new_task;
        if (e.which !== 13) {
          return;
        }
        new_task = {
          'complete': false,
          'desc': $(e.currentTarget).val()
        };
        $li = _this.addTask(new_task);
        _this.subtasks.find('.add.task input[type=text]').val('').focus();
        return _this.triggerHandler('add', {
          'li': $li,
          'task': new_task
        });
      };
    })(this)).on('click', '.task .remove-task', (function(_this) {
      return function(e) {
        var $li;
        $li = $(e.currentTarget).parent('li.task');
        if (_this.opts.beforeRemove && typeof _this.opts.beforeRemove === 'function') {
          return _this.opts.beforeRemove($li, $li.data('task'), function() {
            return _this.removeTask($li);
          });
        } else {
          return _this.removeTask($li);
        }
      };
    })(this));
  };

  Subtasks.prototype.setTasks = function(tasks) {
    var i, len, results, t;
    if (!(tasks instanceof Array)) {
      throw new Error("simple-subtasks: setTasks args must be Array");
    }
    this.subtasks.find('ul').html('');
    results = [];
    for (i = 0, len = tasks.length; i < len; i++) {
      t = tasks[i];
      results.push(this.addTask(t));
    }
    return results;
  };

  Subtasks.prototype.addTask = function(task) {
    var $li;
    $li = $("<li class='task'><input type='checkbox' /><input type='text' value='" + task.desc + "' /><span class='remove-task'>×</span></li>");
    $li.data('task', task);
    if (task.complete) {
      $li.addClass('complete').find("input[type='checkbox']").attr('checked', true);
    }
    $li.insertBefore(this.add_input);
    this._renderCheckbox($li.find('input[type=checkbox]'));
    return $li;
  };

  Subtasks.prototype.removeTask = function($li) {
    $li.remove();
    return this.subtasks.triggerHandler('remove', {
      'li': $li,
      'task': $li.data('task')
    });
  };

  Subtasks.prototype.destroy = function() {};

  return Subtasks;

})(SimpleModule);

subtasks = function(opts) {
  return new Subtasks(opts);
};

return subtasks;

}));

