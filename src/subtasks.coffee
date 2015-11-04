class Subtasks extends SimpleModule

  opts:
    el: null
    cls: null
    size: 18
    animation: false
    beforeRemove: null

  _tpl: """
    <ul class='simple-subtasks'></ul>
  """

  _taskTpl: """
    <li class='task'><input type='checkbox' /><textarea rows='1'></textarea><span class='icon-remove-task'>×</span></li>
  """

  _addTpl: """
    <li class='add task'><span class='icon-add-task'>+</span><textarea rows='1' placeholder='添加子任务'></textarea></li>
  """

  _init: ->
    if not simple.checkbox
      throw new Error "simple-subtasks: simple.checkbox is required"
    if @opts.el is null
      throw new Error "simple-subtasks: el option is invalid"
    @el = @opts.el
    @_render()
    @_bind()


  _render: ->
    @subtasks = $(@_tpl).addClass(@opts.cls)
    @add_textarea = $(@_addTpl)
    @subtasks.append(@add_textarea)
    @el.data 'subtasks', @subtasks
    @subtasks.appendTo @el


  _renderCheckbox: (el_array) ->
    el_array.each (index, el) =>
      simple.checkbox
        el: el
        size: @opts.size
        animation: @opts.animation


  _bind: ->
    @subtasks.on 'checked', '.task .simple-checkbox', (e) =>
      $task = $(e.currentTarget).parent('li.task')
      task = $task.data('task')
      task.complete = true
      $task.addClass('complete').data('task', task)
        .find('textarea').prop('disabled', 'true')
      @_triggerEvent 'complete', $task

    .on 'unchecked', '.task .simple-checkbox', (e) =>
      $task = $(e.currentTarget).parent('li.task')
      task = $task.data('task')
      task.complete = false
      $task.removeClass('complete').data('task', task)
        .find('textarea').prop('disabled', false)
      @_triggerEvent 'reopen', $task

    .on 'keydown', '.task textarea', (e) =>
      return unless e.which == 13
      e.preventDefault()
      $textarea = $(e.currentTarget)
      $task = $textarea.parent('li.task')
      if $task.hasClass 'add'
        new_task =
          complete: false
          desc: $textarea.val()
        $task = @addTask(new_task)
        $task.data('task', new_task)
        $textarea.val('').focus()
        @_triggerEvent 'create', $task
      else
        task = $task.data('task')
        task.desc = $textarea.val()
        $task.data 'task', task
        @_triggerEvent 'edit', $task

    .on 'blur', '.task:not(.add) textarea', (e) =>
      $textarea = $(e.currentTarget)
      $task = $textarea.parent('li.task')
      if $textarea.val()
        task = $task.data('task')
        task.desc = $textarea.val()
        $task.data 'task', task
        @_triggerEvent 'edit', $task
      else
        @removeTask $task

    .on 'click', '.task .icon-remove-task', (e) =>
      $task = $(e.currentTarget).parent('li.task')
      if @opts.beforeRemove and typeof @opts.beforeRemove is 'function'
        @opts.beforeRemove $task, $task.data('task'), =>
          @removeTask $task
      else
        @removeTask $task


  _triggerEvent: (type, $task) ->
    @trigger type,
      li: $task
      task: $task.data('task')
    @trigger 'update',
      type: type
      li: $task
      task: $task.data('task')


  setTasks: (tasks) ->
    throw new Error "simple-subtasks: setTasks args must be Array" unless tasks instanceof Array
    @subtasks.find('ul').html('')
    for t in tasks
      @addTask(t)
    @


  getTasks: ->
    tasks = []
    @subtasks.find('li.task:not(.add)').each (index, li)->
      tasks.push $(li).data('task')
    tasks


  addTask: (task) ->
    $task = $(@_taskTpl)
    $task.data('task', task).find('textarea').val task.desc
    if task.complete
      $task.addClass('complete')
        .find("input[type='checkbox']").prop('checked', true)
        .end().find('textarea').prop('disabled', true)
    $task.insertBefore @add_textarea
    @_renderCheckbox $task.find('input[type=checkbox]')
    $task


  removeTask: ($task) ->
    # 先触发事件后删除, 否则 data 取不到参数
    @_triggerEvent 'remove', $task
    $task.remove()


  destroy: ->
    @subtasks.remove()


subtasks = (opts) ->
  new Subtasks(opts)
