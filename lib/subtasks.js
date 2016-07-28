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
    type: 'circle',
    beforeRemove: null,
    createSplit: null,
    editable: true,
    autolink: true
  };

  Subtasks.prototype._tpl = "<div class=\"simple-subtasks\"></div>";

  Subtasks.prototype._progress = "<div class=\"progress\">\n  <span class=\"count\"></span>\n  <div class=\"bar\">\n    <div class=\"inner-bar\"></div>\n  </div>\n</div>";

  Subtasks.prototype._taskTpl = "<div class=\"task\">\n  <input type=\"checkbox\">\n  <div class=\"task-details\">\n    <p class=\"task-content\"></p>\n    <div class=\"task-form\">\n      <textarea rows=\"1\"></textarea>\n      <div class=\"edit-controls\">\n        <a class=\"btn link-submit-edit\" href=\"javascript:;\">保存</a>\n        <a class=\"btn btn-x link-cancel-edit\" href=\"javascript:;\">取消</a>\n        <a href=\"javascript:;\" class=\"btn btn-x link-remove-task\">删除</a>\n      </div>\n    </div>\n  </div>\n</div>";

  Subtasks.prototype._addTpl = "<div class=\"add task\">\n  <i class=\"icon-add-task\"><span>+</span></i>\n    <div class=\"task-details\">\n    <p class=\"task-content\">添加检查项</p>\n    <div class=\"task-form\">\n      <textarea rows=\"1\" placeholder=\"添加检查项\"></textarea>\n      <div class=\"edit-controls\">\n        <a class=\"btn link-submit-edit\" href=\"javascript:;\">添加</a>\n        <a class=\"btn btn-x link-cancel-edit\" href=\"javascript:;\">取消</a>\n      </div>\n    </div>\n  </div>\n</div>";

  Subtasks.prototype._init = function() {
    if (!simple.checkbox) {
      throw new Error("simple-subtasks: simple.checkbox is required");
    }
    if (this.opts.el === null) {
      throw new Error("simple-subtasks: el option is invalid");
    }
    this.el = this.opts.el;
    this.editable = this.opts.editable;
    this._render();
    return this._bind();
  };

  Subtasks.prototype._render = function() {
    this.subtasks = $(this._tpl).addClass(this.opts.cls).append($(this._progress));
    this.addTextarea = $(this._addTpl);
    if (this.editable) {
      this.subtasks.append(this.addTextarea);
    } else {
      this.subtasks.addClass('unable-edit').find('textarea').prop('disabled', true);
    }
    this.subtasks.data('subtasks', this);
    return this.subtasks.appendTo(this.el);
  };

  Subtasks.prototype._renderCheckbox = function(el_array) {
    return el_array.each((function(_this) {
      return function(index, el) {
        return simple.checkbox({
          el: el,
          size: _this.opts.size,
          animation: _this.opts.animation,
          type: _this.opts.type
        });
      };
    })(this));
  };

  Subtasks.prototype._bind = function() {
    return this.subtasks.on('checked', '.task .simple-checkbox', (function(_this) {
      return function(e) {
        var $task, task;
        $task = $(e.currentTarget).closest('.task');
        task = $task.data('task');
        task.complete = true;
        $task.addClass('complete').data('task', task).find('textarea').prop('disabled', 'true');
        return _this._triggerEvent('complete', $task);
      };
    })(this)).on('unchecked', '.task .simple-checkbox', (function(_this) {
      return function(e) {
        var $task, task;
        $task = $(e.currentTarget).closest('.task');
        task = $task.data('task');
        task.complete = false;
        $task.removeClass('complete').data('task', task);
        if (_this.editable) {
          $task.find('textarea').prop('disabled', false);
        }
        return _this._triggerEvent('reopen', $task);
      };
    })(this)).on('focus', '.task textarea', (function(_this) {
      return function(e) {
        var $textarea;
        $textarea = $(e.currentTarget);
        if (!$textarea.val().trim()) {
          return;
        }
        return _this.current_task = $textarea.closest('.task').data('task');
      };
    })(this)).on('keydown', '.task textarea', (function(_this) {
      return function(e) {
        var $task;
        if (e.which === 13) {
          e.preventDefault();
          $task = $(e.currentTarget).closest('.task');
          return $task.find('.link-submit-edit').trigger('mousedown');
        } else if (e.which === 27) {
          return _this._cancelEdit(e);
        }
      };
    })(this)).on('blur', '.task textarea', this._cancelEdit).on('mousedown', '.task .link-cancel-edit', this._cancelEdit).on('mousedown', '.task .link-submit-edit', (function(_this) {
      return function(e) {
        return _this._updateTask($(e.currentTarget).closest('.task'));
      };
    })(this)).on('mousedown', '.task .link-remove-task', (function(_this) {
      return function(e) {
        var $task;
        $task = $(e.currentTarget).closest('.task');
        if (typeof _this.opts.beforeRemove === 'function') {
          return _this.opts.beforeRemove($task, $task.data('task'), function() {
            return _this.removeTask($task);
          });
        } else {
          return _this.removeTask($task);
        }
      };
    })(this)).on('click', '.task .task-content', (function(_this) {
      return function(e) {
        var $task, $textarea;
        $task = $(e.currentTarget).closest('.task');
        $textarea = $task.find('textarea');
        if ($textarea.is('[disabled]')) {
          return;
        }
        $task.addClass('editing');
        $textarea.select();
        return _this._triggerEvent('edit', $task);
      };
    })(this)).on('click', '.task a[target="_blank"]', function(e) {
      return e.stopPropagation();
    });
  };

  Subtasks.prototype._triggerEvent = function(type, $el) {
    var params;
    params = {
      type: type,
      element: $el
    };
    if (type.indexOf('batch') === 0) {
      params.tasks = $el.map(function(el) {
        return el.data('task');
      });
    } else {
      params.task = $el.data('task');
    }
    this.trigger(type, params);
    if (['create', 'batchCreate', 'complete', 'reopen'].indexOf(type) > -1) {
      this.trigger('update', params);
      return this._renderProgress();
    }
  };

  Subtasks.prototype._cancelEdit = function(e) {
    var $task, $textarea, ref;
    $textarea = $(e.currentTarget);
    $task = $textarea.closest('.task').removeClass('editing');
    return $textarea.val((ref = $task.data('task')) != null ? ref.desc : void 0);
  };

  Subtasks.prototype._updateTask = function($task) {
    var $tasks, $textarea, content, descStrs, i, len, newTasks, str, task;
    $textarea = $task.find('textarea');
    content = $textarea.val().trim().replace(new RegExp("[" + this.opts.createSplit + "]{2,}", 'g'), this.opts.createSplit);
    if (!content) {
      return;
    }
    if ($task.hasClass('add')) {
      descStrs = content.split(this.opts.createSplit);
      if (!this.opts.createSplit || descStrs.length === 1) {
        newTasks = {
          complete: false,
          desc: content
        };
        $task = this.addTask(newTasks);
        this._triggerEvent('create', $task);
      } else {
        newTasks = [];
        for (i = 0, len = descStrs.length; i < len; i++) {
          str = descStrs[i];
          if (str.trim() === '') {
            continue;
          }
          newTasks.push({
            complete: false,
            desc: str.trim().replace(this.opts.createSplit, '')
          });
        }
        $tasks = this.addTasks(newTasks);
        this._triggerEvent('batchCreate', $tasks);
      }
      return $textarea.val('');
    } else {
      task = $task.removeClass('editing').data('task');
      if (task.desc === content) {
        return;
      }
      task.desc = content;
      $task.data('task', task);
      $task.find('.task-content').html(this._renderLinks(content));
      return this._triggerEvent('update', $task);
    }
  };

  Subtasks.prototype._renderProgress = function() {
    var $progress, all, complete;
    $progress = this.subtasks.find('.progress');
    complete = this.subtasks.find('.task.complete').length;
    all = this.subtasks.find('.task').length;
    $progress.find('.count').text(complete + "/" + all);
    return $progress.find('.inner-bar').css({
      width: (complete / all * 100) + "%"
    });
  };

  Subtasks.prototype._renderLinks = function(content) {
    if (this.opts.autolink) {
      return content.autolink({
        target: '_blank'
      });
    } else {
      return content;
    }
  };

  Subtasks.prototype.setTasks = function(tasks) {
    if (!(tasks instanceof Array)) {
      throw new Error("simple-subtasks: setTasks args must be Array");
    }
    this.subtasks.find('.simple-subtasks').empty();
    this.addTasks(tasks);
    this._renderProgress();
    return this;
  };

  Subtasks.prototype.getTasks = function() {
    var tasks;
    tasks = [];
    this.subtasks.find('.task:not(.add)').each(function(index, task) {
      return tasks.push($(task).data('task'));
    });
    return tasks;
  };

  Subtasks.prototype.addTask = function(task) {
    var $task;
    $task = $(this._taskTpl);
    $task.data('task', task).find('textarea').val(task.desc).end().find('.task-content').html(this._renderLinks(task.desc));
    if (task.complete) {
      $task.addClass('complete').find("input[type='checkbox']").prop('checked', true).end().find('textarea').prop('disabled', true);
    }
    if (this.editable) {
      $task.insertBefore(this.addTextarea);
    } else {
      $task.find('textarea').prop('disabled', true);
      $task.appendTo(this.subtasks);
    }
    this._renderCheckbox($task.find('input[type=checkbox]'));
    return $task;
  };

  Subtasks.prototype.addTasks = function(tasks) {
    var $task, els, i, index, len, task;
    els = [];
    for (index = i = 0, len = tasks.length; i < len; index = ++i) {
      task = tasks[index];
      $task = $(this._taskTpl);
      $task.data('task', task).find('textarea').val(task.desc).end().find('.task-content').html(this._renderLinks(task.desc));
      if (task.complete) {
        $task.addClass('complete').find("input[type='checkbox']").prop('checked', true).end().find('textarea').prop('disabled', true);
      }
      if (this.editable) {
        $task.insertBefore(this.addTextarea);
      } else {
        $task.find('textarea').prop('disabled', true);
        $task.appendTo(this.subtasks);
      }
      this._renderCheckbox($task.find('input[type=checkbox]'));
      els.push($task);
    }
    return els;
  };

  Subtasks.prototype.removeTask = function($task) {
    var params, task;
    if ($task.hasClass('add')) {
      return;
    }
    task = $task.data('task');
    $task.remove();
    params = {
      type: 'remove',
      element: null,
      task: task
    };
    this.trigger('remove', params);
    return this.trigger('update', params);
  };

  Subtasks.prototype.sync = function() {
    var params;
    params = {
      type: 'sync',
      element: null,
      tasks: null
    };
    return this.trigger('update', params);
  };

  Subtasks.prototype.destroy = function() {
    return this.subtasks.remove();
  };

  return Subtasks;

})(SimpleModule);

subtasks = function(opts) {
  return new Subtasks(opts);
};

var autolink,
  slice = [].slice;

autolink = function() {
  var callback, k, linkAttributes, option, options, pattern, v;
  options = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  pattern = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
  if (!(options.length > 0)) {
    return this.replace(pattern, "$1<a href='$2'>$2</a>");
  }
  option = options[0];
  callback = option["callback"];
  linkAttributes = ((function() {
    var results;
    results = [];
    for (k in option) {
      v = option[k];
      if (k !== 'callback') {
        results.push(" " + k + "='" + v + "'");
      }
    }
    return results;
  })()).join('');
  return this.replace(pattern, function(match, space, url) {
    var link;
    link = (typeof callback === "function" ? callback(url) : void 0) || ("<a href='" + url + "'" + linkAttributes + ">" + url + "</a>");
    return "" + space + link;
  });
};

String.prototype['autolink'] = autolink;

return subtasks;

}));

