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
    size: 18,
    animation: false,
    beforeRemove: null
  };

  Subtasks.prototype._tpl = "<ul class='simple-subtasks'></ul>";

  Subtasks.prototype._taskTpl = "<li class='task'><input type='checkbox' /><textarea rows='1'></textarea><i class='icon-remove-task'><span>×</span></i></li>";

  Subtasks.prototype._addTpl = "<li class='add task'><i class='icon-add-task'><span>+</span></i><textarea rows='1' placeholder='添加子任务'></textarea></li>";

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
    this.add_textarea = $(this._addTpl);
    this.subtasks.append(this.add_textarea);
    this.el.data('subtasks', this.subtasks);
    return this.subtasks.appendTo(this.el);
  };

  Subtasks.prototype._renderCheckbox = function(el_array) {
    return el_array.each((function(_this) {
      return function(index, el) {
        return simple.checkbox({
          el: el,
          size: _this.opts.size,
          animation: _this.opts.animation
        });
      };
    })(this));
  };

  Subtasks.prototype._bind = function() {
    return this.subtasks.on('checked', '.task .simple-checkbox', (function(_this) {
      return function(e) {
        var $task, task;
        $task = $(e.currentTarget).parent('li.task');
        task = $task.data('task');
        task.complete = true;
        $task.addClass('complete').data('task', task).find('textarea').prop('disabled', 'true');
        return _this._triggerEvent('complete', $task);
      };
    })(this)).on('unchecked', '.task .simple-checkbox', (function(_this) {
      return function(e) {
        var $task, task;
        $task = $(e.currentTarget).parent('li.task');
        task = $task.data('task');
        task.complete = false;
        $task.removeClass('complete').data('task', task).find('textarea').prop('disabled', false);
        return _this._triggerEvent('reopen', $task);
      };
    })(this)).on('keydown', '.task textarea', (function(_this) {
      return function(e) {
        var $task, $textarea, new_task, task;
        if (e.which !== 13) {
          return;
        }
        e.preventDefault();
        $textarea = $(e.currentTarget);
        $task = $textarea.parent('li.task');
        if ($task.hasClass('add')) {
          new_task = {
            complete: false,
            desc: $textarea.val()
          };
          $task = _this.addTask(new_task);
          $task.data('task', new_task);
          $textarea.val('').focus();
          return _this._triggerEvent('create', $task);
        } else {
          task = $task.data('task');
          task.desc = $textarea.val();
          $task.data('task', task);
          return _this._triggerEvent('edit', $task);
        }
      };
    })(this)).on('blur', '.task:not(.add) textarea', (function(_this) {
      return function(e) {
        var $task, $textarea, task;
        $textarea = $(e.currentTarget);
        $task = $textarea.parent('li.task');
        if ($textarea.val()) {
          task = $task.data('task');
          task.desc = $textarea.val();
          $task.data('task', task);
          return _this._triggerEvent('edit', $task);
        } else {
          return _this.removeTask($task);
        }
      };
    })(this)).on('click', '.task .icon-remove-task', (function(_this) {
      return function(e) {
        var $task;
        $task = $(e.currentTarget).parent('li.task');
        if (_this.opts.beforeRemove && typeof _this.opts.beforeRemove === 'function') {
          return _this.opts.beforeRemove($task, $task.data('task'), function() {
            return _this.removeTask($task);
          });
        } else {
          return _this.removeTask($task);
        }
      };
    })(this));
  };

  Subtasks.prototype._triggerEvent = function(type, $task) {
    this.trigger(type, {
      li: $task,
      task: $task.data('task')
    });
    return this.trigger('update', {
      type: type,
      li: $task,
      task: $task.data('task')
    });
  };

  Subtasks.prototype.setTasks = function(tasks) {
    var i, len, t;
    if (!(tasks instanceof Array)) {
      throw new Error("simple-subtasks: setTasks args must be Array");
    }
    this.subtasks.find('ul').html('');
    for (i = 0, len = tasks.length; i < len; i++) {
      t = tasks[i];
      this.addTask(t);
    }
    return this;
  };

  Subtasks.prototype.getTasks = function() {
    var tasks;
    tasks = [];
    this.subtasks.find('li.task:not(.add)').each(function(index, li) {
      return tasks.push($(li).data('task'));
    });
    return tasks;
  };

  Subtasks.prototype.addTask = function(task) {
    var $task;
    $task = $(this._taskTpl);
    $task.data('task', task).find('textarea').val(task.desc);
    if (task.complete) {
      $task.addClass('complete').find("input[type='checkbox']").prop('checked', true).end().find('textarea').prop('disabled', true);
    }
    $task.insertBefore(this.add_textarea);
    this._renderCheckbox($task.find('input[type=checkbox]'));
    return $task;
  };

  Subtasks.prototype.removeTask = function($task) {
    this._triggerEvent('remove', $task);
    return $task.remove();
  };

  Subtasks.prototype.destroy = function() {
    return this.subtasks.remove();
  };

  return Subtasks;

})(SimpleModule);

subtasks = function(opts) {
  return new Subtasks(opts);
};

return subtasks;

}));

