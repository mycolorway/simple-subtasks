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

  Subtasks.prototype._taskTpl = "    ";

  Subtasks.prototype._addTpl = "<li class='add task'><span class='icon-add-task'>+</span><input type='text' autofocus='autofocus' placeholder='添加子任务'/></li>";

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
    this.add_input = $(this._addTpl);
    this.subtasks.append(this.add_input);
    this.el.data('subtasks', this.subtasks);
    return this.subtasks.appendTo(this.el);
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
        var $li, task;
        $li = $(e.currentTarget).parent('li.task');
        task = $li.data('task');
        task.complete = true;
        $li.addClass('complete').data('task', task).find('input[type=text]').attr('disabled', 'true');
        return _this._triggerEvent('complete', $li);
      };
    })(this)).on('unchecked', '.task .simple-checkbox', (function(_this) {
      return function(e) {
        var $li, task;
        $li = $(e.currentTarget).parent('li.task');
        task = $li.data('task');
        task.complete = false;
        $li.removeClass('complete').data('task', task).find('input[type=text]').removeAttr('disabled');
        return _this._triggerEvent('reopen', $li);
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
        $li.data('task', new_task);
        _this.subtasks.find('.add.task input[type=text]').val('').focus();
        return _this._triggerEvent('create', $li);
      };
    })(this)).on('keyup', '.task:not(.add) input[type=text]', (function(_this) {
      return function(e) {
        var $input, $li, task;
        if (e.which !== 13) {
          return;
        }
        $input = $(e.currentTarget);
        $li = $input.parent('li.task');
        task = $li.data('task');
        task.desc = $input.val();
        $li.data('task', task);
        return _this._triggerEvent('edit', $li);
      };
    })(this)).on('click', '.task .icon-remove-task', (function(_this) {
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

  Subtasks.prototype._triggerEvent = function(type, $li) {
    this.trigger(type, {
      'li': $li,
      'task': $li.data('task')
    });
    return this.trigger('update', {
      'type': type,
      'li': $li,
      'task': $li.data('task')
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
    var $li;
    $li = $("<li class='task'><input type='checkbox' /><input type='text' value='" + task.desc + "' /><span class='icon-remove-task'>×</span></li>");
    $li.data('task', task);
    if (task.complete) {
      $li.addClass('complete').find("input[type='checkbox']").attr('checked', true);
    }
    $li.insertBefore(this.add_input);
    this._renderCheckbox($li.find('input[type=checkbox]'));
    return $li;
  };

  Subtasks.prototype.removeTask = function($li) {
    this._triggerEvent('remove', $li);
    return $li.remove();
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

