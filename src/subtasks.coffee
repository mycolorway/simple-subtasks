class Subtasks extends SimpleModule

  opts:
    el: null
    cls: null
    size: 18
    animation: false
    type: 'circle' # or 'square'
    beforeRemove: null

  _tpl: """
    <ul class='simple-subtasks'></ul>
  """

  _taskTpl: """
    <li class='task'><input type='checkbox' /><textarea rows='1'></textarea><i class='icon-remove-task'><span>×</span></i></li>
  """

  _addTpl: """
    <li class='add task'><i class='icon-add-task'><span>+</span></i><textarea rows='1' placeholder='添加子任务'></textarea></li>
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
    @el.data 'subtasks', @
    @subtasks.appendTo @el


  _renderCheckbox: (el_array) ->
    el_array.each (index, el) =>
      simple.checkbox
        el: el
        size: @opts.size
        animation: @opts.animation
        type: @opts.type


  _bind: ->
    @subtasks.on 'checked', '.task .simple-checkbox', (e) =>
      $task = $(e.currentTarget).closest('.task')
      task = $task.data('task')
      task.complete = true
      $task.addClass('complete').data('task', task)
        .find('textarea').prop('disabled', 'true')
      @_triggerEvent 'complete', $task

    .on 'unchecked', '.task .simple-checkbox', (e) =>
      $task = $(e.currentTarget).closest('.task')
      task = $task.data('task')
      task.complete = false
      $task.removeClass('complete').data('task', task)
        .find('textarea').prop('disabled', false)
      @_triggerEvent 'reopen', $task

    .on 'focus', '.task textarea', (e)=>
      $textarea = $(e.currentTarget)
      return unless $textarea.val().trim()
      @current_task = $textarea.closest('.task').data('task')

    .on 'keydown', '.task textarea', (e) =>
      return unless e.which == 13
      e.preventDefault()
      $textarea = $(e.currentTarget)
      if $textarea.closest('.task').hasClass 'add'
        @_updateTask $textarea
        $textarea.focus()
      else
        $textarea.trigger 'blur'

    .on 'blur', '.task textarea', (e) =>
      $textarea = $(e.currentTarget)
      if $textarea.val().trim()
        @_updateTask $textarea
      else
        @removeTask $textarea.closest('.task')

    .on 'click', '.task .icon-remove-task', (e) =>
      $task = $(e.currentTarget).closest('.task')
      if typeof @opts.beforeRemove is 'function'
        @opts.beforeRemove $task, $task.data('task'), =>
          @removeTask $task
      else
        @removeTask $task


  _triggerEvent: (type, $task) ->
    params =
      type: type
      element: $task
      task: $task.data('task')
    @trigger type, params
    @trigger 'update', params


  _updateTask: ($textarea) ->
    $task = $textarea.closest('.task')
    content = $textarea.val().trim()
    return  unless content

    if $task.hasClass 'add'
      new_task =
        complete: false
        desc: content
      $task = @addTask(new_task)
      $task.data('task', new_task)
      $textarea.val('')
      @_triggerEvent 'create', $task
    else
      task = $task.data('task')
      return if task.desc == content
      task.desc = content
      $task.data 'task', task
      @_triggerEvent 'edit', $task


  setTasks: (tasks) ->
    throw new Error "simple-subtasks: setTasks args must be Array" unless tasks instanceof Array
    @subtasks.find('.simple-subtasks').empty()
    for t in tasks
      @addTask(t)
    @


  getTasks: ->
    tasks = []
    @subtasks.find('.task:not(.add)').each (index, task)->
      tasks.push $(task).data('task')
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
    return  if $task.hasClass 'add'
    task = $task.data 'task'
    $task.remove()
    params =
      type: 'remove'
      element: null
      task: task
    @trigger 'remove', params
    @trigger 'update', params


  destroy: ->
    @subtasks.remove()


subtasks = (opts) ->
  new Subtasks(opts)
