class Subtasks extends SimpleModule

  opts:
    el: null
    cls: null
    size: 18
    animation: false
    type: 'circle' # or 'square'
    beforeRemove: null
    createSplit: null
    editable: true
    autolink: true

  _tpl: """
    <div class="simple-subtasks"></div>
  """

  _progress: """
    <div class="progress">
      <span class="count"></span>
      <div class="bar">
        <div class="inner-bar"></div>
      </div>
    </div>
  """

  _taskTpl: """
    <div class="task">
      <input type="checkbox">
      <div class="task-details">
        <p class="task-content"></p>
        <div class="task-form">
          <textarea rows="1"></textarea>
          <div class="edit-controls">
            <a class="btn link-submit-edit" href="javascript:;">保存</a>
            <a class="btn btn-x link-cancel-edit" href="javascript:;">取消</a>
            <a href="javascript:;" class="btn btn-x link-remove-task">删除</a>
          </div>
        </div>
      </div>
    </div>
  """

  _addTpl: """
    <div class="add task">
      <i class="icon-add-task"><span>+</span></i>
        <div class="task-details">
        <p class="task-content">添加检查项</p>
        <div class="task-form">
          <textarea rows="1" placeholder="添加检查项"></textarea>
          <div class="edit-controls">
            <a class="btn link-submit-edit" href="javascript:;">添加</a>
            <a class="btn btn-x link-cancel-edit" href="javascript:;">取消</a>
          </div>
        </div>
      </div>
    </div>
  """

  _init: ->
    if not simple.checkbox
      throw new Error "simple-subtasks: simple.checkbox is required"
    if @opts.el is null
      throw new Error "simple-subtasks: el option is invalid"
    @el = @opts.el
    @editable = @opts.editable
    @_render()
    @_bind()


  _render: ->
    @subtasks = $(@_tpl).addClass(@opts.cls).append $(@_progress)
    @addTextarea = $(@_addTpl)
    if @editable
      @subtasks.append(@addTextarea)
    else
      @subtasks.addClass('unable-edit').find('textarea').prop('disabled', true)
    @subtasks.data 'subtasks', @
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
      $task.find('textarea').prop('disabled', false) if @editable
      @_triggerEvent 'reopen', $task

    .on 'focus', '.task textarea', (e)=>
      $textarea = $(e.currentTarget)
      return unless $textarea.val().trim()
      @current_task = $textarea.closest('.task').data('task')

    .on 'keydown', '.task textarea', (e) =>
      if e.which == 13
        e.preventDefault()
        $task = $(e.currentTarget).closest('.task')
        $task.find('.link-submit-edit').trigger 'mousedown'
      else if e.which == 27
        @_cancelEdit(e)

    .on 'blur', '.task textarea', @_cancelEdit
    .on 'mousedown', '.task .link-cancel-edit', @_cancelEdit
    .on 'mousedown', '.task .link-submit-edit', (e) =>
      @_updateTask $(e.currentTarget).closest('.task')

    .on 'mousedown', '.task .link-remove-task', (e) =>
      $task = $(e.currentTarget).closest('.task')
      if typeof @opts.beforeRemove is 'function'
        @opts.beforeRemove $task, $task.data('task'), =>
          @removeTask $task
      else
        @removeTask $task

    .on 'click', '.task .task-content', (e) =>
      $task = $(e.currentTarget).closest('.task')
      $textarea = $task.find('textarea')
      return if $textarea.is('[disabled]')
      $task.addClass('editing')
      $textarea.select()
      @_triggerEvent 'edit', $task

    .on 'click', '.task a[target="_blank"]', (e) ->
      e.stopPropagation()


  _triggerEvent: (type, $el) ->
    params =
      type: type
      element: $el
    if type.indexOf('batch') == 0
      params.tasks = $el.map((el)->
        return el.data('task')
      )
    else
      params.task = $el.data('task')
    @trigger type, params
    if ['create', 'batchCreate', 'complete', 'reopen'].indexOf(type) > -1
      @trigger 'update', params
      @_renderProgress()


  _cancelEdit: (e) ->
    $textarea = $(e.currentTarget)
    $task = $textarea.closest('.task').removeClass('editing')
    $textarea.val $task.data('task')?.desc


  _updateTask: ($task) ->
    $textarea = $task.find('textarea')
    # 过滤字符串
    content = $textarea.val().trim().replace(new RegExp("[#{@opts.createSplit}]{2,}",'g'), @opts.createSplit)
    return unless content

    if $task.hasClass 'add'
      descStrs = content.split(@opts.createSplit)
      if not @opts.createSplit or descStrs.length == 1
        newTasks =
          complete: false
          desc: content
        $task = @addTask(newTasks)
        @_triggerEvent 'create', $task
      else
        newTasks = []
        for str in descStrs
          continue if str.trim() == ''
          newTasks.push
            complete: false
            desc: str.trim().replace(@opts.createSplit, '')
        $tasks = @addTasks(newTasks)
        @_triggerEvent 'batchCreate', $tasks
      $textarea.val('')
    else
      task = $task.removeClass('editing').data('task')
      return if task.desc == content
      task.desc = content
      $task.data 'task', task
      $task.find('.task-content').html @_renderLinks(content)
      @_triggerEvent 'update', $task


  _renderProgress: ->
    $progress = @subtasks.find('.progress')
    $tasks = @subtasks.find('.task:not(.add)')
    count = parseInt($tasks.filter('.complete').length / $tasks.length * 100)
    count = 0 if isNaN(count)
    $progress.find('.count').text "#{ count }%"
    $progress.find('.inner-bar').css
      width: "#{ count }%"


  _renderLinks: (content) ->
    return if @opts.autolink
              content.autolink {target: '_blank'}
            else
              content


  setTasks: (tasks) ->
    throw new Error "simple-subtasks: setTasks args must be Array" unless tasks instanceof Array
    @subtasks.find('.simple-subtasks').empty()
    @addTasks(tasks)
    @_renderProgress()
    @


  getTasks: ->
    tasks = []
    @subtasks.find('.task:not(.add)').each (index, task)->
      tasks.push $(task).data('task')
    tasks


  addTask: (task) ->
    $task = $(@_taskTpl)
    $task.data('task', task)
      .find('textarea').val task.desc
      .end()
      .find('.task-content')
      .html @_renderLinks(task.desc)
    if task.complete
      $task.addClass('complete')
        .find("input[type='checkbox']").prop('checked', true)
        .end().find('textarea').prop('disabled', true)
    if @editable
      $task.insertBefore @addTextarea
    else
      $task.find('textarea').prop('disabled', true)
      $task.appendTo(@subtasks)
    @_renderCheckbox $task.find('input[type=checkbox]')
    $task


  addTasks: (tasks) ->
    els = []
    for task, index in tasks
      $task = $(@_taskTpl)
      $task.data('task', task)
        .find('textarea').val task.desc
        .end()
        .find('.task-content')
        .html @_renderLinks(task.desc)
      if task.complete
        $task.addClass('complete')
          .find("input[type='checkbox']").prop('checked', true)
          .end().find('textarea').prop('disabled', true)
      if @editable
        $task.insertBefore @addTextarea
      else
        $task.find('textarea').prop('disabled', true)
        $task.appendTo(@subtasks)
      @_renderCheckbox $task.find('input[type=checkbox]')
      els.push($task)
    els


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


  sync: ->
    params =
      type: 'sync'
      element: null
      tasks: null
    @trigger 'update', params


  destroy: ->
    @subtasks.remove()


subtasks = (opts) ->
  new Subtasks(opts)
