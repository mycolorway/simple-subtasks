describe('simple-subtasks', function() {
  var $el, $subtasks, findTaskEl;
  $el = $('<div id="subtasks"></div>');
  $el.appendTo('body');
  $subtasks = null;
  findTaskEl = function($el, desc) {
    var target;
    target = null;
    $el.find('.task:not(.add)').each(function(indexm, task_el) {
      var task;
      task = $(task_el).data('task');
      if (task.desc === desc) {
        return target = task_el;
      }
    });
    return $(target);
  };
  beforeEach(function() {
    var data;
    data = [
      {
        'complete': false,
        'desc': 'A normal sub-task'
      }, {
        'complete': true,
        'desc': 'A completed sub-task'
      }
    ];
    simple.subtasks({
      el: $("#subtasks"),
      size: 22,
      animation: true,
      beforeRemove: function(el, task, remove_task) {
        return remove_task();
      }
    }).setTasks(data);
    return $subtasks = $el.find('.simple-subtasks').data('subtasks');
  });
  afterEach(function() {
    $('.simple-subtasks').data('subtasks').destroy();
    return $subtasks = null;
  });
  it('should render subtasks', function() {
    expect($el.find('.simple-subtasks')).toExist();
    expect($el.find('.simple-subtasks .task:not(.add)')).toExist();
    return expect($el.find('.simple-subtasks .add.task')).toExist();
  });
  it('should render complete task when complete is true', function() {
    $el.find('.task');
    return expect(findTaskEl($el, 'A completed sub-task')).toHaveClass('complete');
  });
  it('should toggle state when click checkbox', function() {
    var $task;
    $task = $el.find('.task.complete').first();
    $task.find('.simple-checkbox').trigger('click');
    expect($task).not.toHaveClass('complete');
    expect($task.find('.simple-checkbox')).not.toHaveClass('checked');
    $task.find('.simple-checkbox').trigger('click');
    expect($task).toHaveClass('complete');
    return expect($task.find('.simple-checkbox')).toHaveClass('checked');
  });
  it('should trigger complete and update event when click checkbox', function() {
    var $task, spyEventComplete, spyEventUpdate;
    spyEventComplete = spyOnEvent($subtasks, 'complete');
    spyEventUpdate = spyOnEvent($subtasks, 'update');
    $task = $el.find('.task:not(.complete)').first();
    $task.find('.simple-checkbox').trigger('click');
    expect(spyEventComplete).toHaveBeenTriggered();
    return expect(spyEventUpdate).toHaveBeenTriggered();
  });
  it('should trigger reopen and update event when click checked checkbox', function() {
    var $task, spyEventComplete, spyEventUpdate;
    spyEventComplete = spyOnEvent($subtasks, 'reopen');
    spyEventUpdate = spyOnEvent($subtasks, 'update');
    $task = $el.find('.task.complete').first();
    $task.find('.simple-checkbox').trigger('click');
    expect(spyEventComplete).toHaveBeenTriggered();
    return expect(spyEventUpdate).toHaveBeenTriggered();
  });
  return it('should add new task when add task textarea trigger enter event', function() {
    var $add_task, evt, spyEventCreate, spyEventUpdate;
    spyEventCreate = spyOnEvent($subtasks, 'create');
    spyEventUpdate = spyOnEvent($subtasks, 'update');
    $add_task = $el.find('.add.task');
    evt = $.Event('keydown');
    evt.which = 13;
    $add_task.find('textarea').val('Another sub-task').trigger(evt);
    expect(findTaskEl($el, 'Another sub-task')).toExist();
    expect($('.add.task textarea').val()).toBe('');
    expect(spyEventCreate).toHaveBeenTriggered();
    return expect(spyEventUpdate).toHaveBeenTriggered();
  });
});
