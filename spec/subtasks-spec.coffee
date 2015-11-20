describe 'simple-subtasks', ->
  $el = $('<div id="subtasks"></div>')
  $el.appendTo('body')

  $subtasks = null

  findTaskEl = ($el, desc)->
    target = null
    $el.find('.task:not(.add)').each((indexm, task_el)->
      task = $(task_el).data('task')
      if task.desc == desc
        target = task_el
    )
    $(target)

  beforeEach ->
    data = [{
        'complete': false,
        'desc': 'A normal sub-task'
    }, {
        'complete': true,
        'desc': 'A completed sub-task'
    }];
    simple.subtasks
        el: $("#subtasks"),
        size: 22,
        animation: true,
        beforeRemove: (el, task, remove_task)->
          remove_task();
    .setTasks(data);
    $subtasks = $el.find('.simple-subtasks').data('subtasks')

  afterEach ->
    $('.simple-subtasks').data('subtasks').destroy()
    $subtasks = null

  # render
  it 'should render subtasks', ->
    expect($el.find('.simple-subtasks')).toExist()
    expect($el.find('.simple-subtasks .task:not(.add)')).toExist()
    expect($el.find('.simple-subtasks .add.task')).toExist()

  it 'should render complete task when complete is true', ->
    $el.find('.task')
    expect(findTaskEl($el, 'A completed sub-task')).toHaveClass 'complete'

  # behavior
  it 'should toggle state when click checkbox', ->
    $task = $el.find('.task.complete').first()
    $task.find('.simple-checkbox').trigger 'click'
    expect($task).not.toHaveClass 'complete'
    expect($task.find('.simple-checkbox')).not.toHaveClass 'checked'
    $task.find('.simple-checkbox').trigger 'click'
    expect($task).toHaveClass 'complete'
    expect($task.find('.simple-checkbox')).toHaveClass 'checked'

  it 'should trigger complete and update event when click checkbox', ->
    spyEventComplete = spyOnEvent($subtasks, 'complete')
    spyEventUpdate = spyOnEvent($subtasks, 'update')
    $task = $el.find('.task:not(.complete)').first()
    $task.find('.simple-checkbox').trigger 'click'

    expect(spyEventComplete).toHaveBeenTriggered()
    expect(spyEventUpdate).toHaveBeenTriggered()

  it 'should trigger reopen and update event when click checked checkbox', ->
    spyEventComplete = spyOnEvent($subtasks, 'reopen')
    spyEventUpdate = spyOnEvent($subtasks, 'update')
    $task = $el.find('.task.complete').first()
    $task.find('.simple-checkbox').trigger 'click'

    expect(spyEventComplete).toHaveBeenTriggered()
    expect(spyEventUpdate).toHaveBeenTriggered()

  it 'should add new task when add task textarea trigger enter event', ->
    spyEventCreate = spyOnEvent($subtasks, 'create')
    spyEventUpdate = spyOnEvent($subtasks, 'update')
    $add_task = $el.find('.add.task')
    evt = $.Event('keydown')
    evt.which = 13
    $add_task.find('textarea').val('Another sub-task').trigger(evt)

    expect(findTaskEl($el, 'Another sub-task')).toExist()
    expect($('.add.task textarea').val()).toBe('')

    expect(spyEventCreate).toHaveBeenTriggered()
    expect(spyEventUpdate).toHaveBeenTriggered()


  it 'should change task desc when task textarea trigger enter event', ->
    spyEventEdit = spyOnEvent($subtasks, 'edit')
    spyEventUpdate = spyOnEvent($subtasks, 'update')
    $edit_task = findTaskEl($el, 'A normal sub-task')
    evt = $.Event('keydown')
    evt.which = 13
    $edit_task.find('textarea').val('edit task desc').trigger(evt)

    expect($edit_task.find('textarea').val()).toBe('edit task desc')
    expect(spyEventEdit).toHaveBeenTriggered()
    expect(spyEventUpdate).toHaveBeenTriggered()

  it 'should change task desc when blur task textarea and value is not empty', ->
    spyEventEdit = spyOnEvent($subtasks, 'edit')
    spyEventUpdate = spyOnEvent($subtasks, 'update')
    $edit_task = findTaskEl($el, 'A normal sub-task')
    $edit_task.find('textarea').val('edit task desc').trigger('blur')

    expect($edit_task.find('textarea').val()).toBe('edit task desc')
    expect(spyEventEdit).toHaveBeenTriggered()
    expect(spyEventUpdate).toHaveBeenTriggered()

  it 'should remove task when blur task textarea and value is empty', ->
    spyEventRemove = spyOnEvent($subtasks, 'remove')
    spyEventUpdate = spyOnEvent($subtasks, 'update')
    $remove_task = findTaskEl($el, 'A normal sub-task')
    $remove_task.find('textarea').val('').trigger('blur')

    expect($el.find('.task:contains(A normal sub-task)')).not.toExist()
    expect(spyEventRemove).toHaveBeenTriggered()
    expect(spyEventUpdate).toHaveBeenTriggered()

  it 'should call func beforeRemove when click .icon-remove-task', ->
    spyOn($subtasks.opts, 'beforeRemove')
    $remove_task = findTaskEl($el, 'A normal sub-task')
    $remove_task.find('.icon-remove-task').trigger 'click'
    expect($subtasks.opts.beforeRemove).toHaveBeenCalled()
