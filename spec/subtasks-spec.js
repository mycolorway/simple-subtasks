describe('simple-subtasks', function() {
  var $el, $subtasks;
  $el = $('<div id="subtasks"></div>');
  $el.appendTo('body');
  $subtasks = null;
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
    return $subtasks = $el.data('subtasks');
  });
  afterEach(function() {
    $('#subtasks').data('subtasks').destroy();
    return $subtasks = null;
  });
  it('should render subtasks', function() {
    expect($el.find('.simple-subtasks')).toExist();
    expect($el.find('.simple-subtasks .task')).toExist();
    return expect($el.find('.simple-subtasks .add.task')).toExist();
  });
  it('should render complete task when complete is true', function() {
    return expect($el.find('.task:contains(A completed sub-task)')).toHaveClass('complete');
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
  it('should add new task when add task textarea trigger enter event', function() {
    var $add_task, evt, spyEventCreate, spyEventUpdate;
    spyEventCreate = spyOnEvent($subtasks, 'create');
    spyEventUpdate = spyOnEvent($subtasks, 'update');
    $add_task = $el.find('.add.task');
    evt = $.Event('keydown');
    evt.which = 13;
    $add_task.find('textarea').val('Another sub-task').trigger(evt);
    expect('.task:contains(Another sub-task)').toExist();
    expect($('.add.task textarea').val()).toBe('');
    expect(spyEventCreate).toHaveBeenTriggered();
    return expect(spyEventUpdate).toHaveBeenTriggered();
  });
  it('should change task desc when task textarea trigger enter event', function() {
    var $edit_task, evt, spyEventEdit, spyEventUpdate;
    spyEventEdit = spyOnEvent($subtasks, 'edit');
    spyEventUpdate = spyOnEvent($subtasks, 'update');
    $edit_task = $el.find('.task:contains(A normal sub-task)').first();
    evt = $.Event('keydown');
    evt.which = 13;
    $edit_task.find('textarea').val('edit task desc').trigger(evt);
    expect($edit_task.find('textarea').val()).toBe('edit task desc');
    expect(spyEventEdit).toHaveBeenTriggered();
    return expect(spyEventUpdate).toHaveBeenTriggered();
  });
  it('should change task desc when blur task textarea and value is not empty', function() {
    var $edit_task, spyEventEdit, spyEventUpdate;
    spyEventEdit = spyOnEvent($subtasks, 'edit');
    spyEventUpdate = spyOnEvent($subtasks, 'update');
    $edit_task = $el.find('.task:contains(A normal sub-task)').first();
    $edit_task.find('textarea').val('edit task desc').trigger('blur');
    expect($edit_task.find('textarea').val()).toBe('edit task desc');
    expect(spyEventEdit).toHaveBeenTriggered();
    return expect(spyEventUpdate).toHaveBeenTriggered();
  });
  it('should remove task when blur task textarea and value is empty', function() {
    var $remove_task, spyEventRemove, spyEventUpdate;
    spyEventRemove = spyOnEvent($subtasks, 'remove');
    spyEventUpdate = spyOnEvent($subtasks, 'update');
    $remove_task = $el.find('.task:contains(A normal sub-task)').first();
    $remove_task.find('textarea').val('').trigger('blur');
    expect($el.find('.task:contains(A normal sub-task)')).not.toExist();
    expect(spyEventRemove).toHaveBeenTriggered();
    return expect(spyEventUpdate).toHaveBeenTriggered();
  });
  return it('should call func beforeRemove when click .icon-remove-task', function() {
    var $remove_task;
    spyOn($subtasks.opts, 'beforeRemove');
    $remove_task = $el.find('.task:contains(A normal sub-task)').first();
    $remove_task.find('.icon-remove-task').trigger('click');
    return expect($subtasks.opts.beforeRemove).toHaveBeenCalled();
  });
});
