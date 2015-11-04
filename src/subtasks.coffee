class Subtasks extends SimpleModule

  opts:
    el: null
    cls: null
    beforeRemove: null

  _tpl: """
    <ul class='simple-subtasks'>
    </ul>
  """

  _taskTpl: """
    
  """

  _addTpl: """
    <li class='add task'><span class='icon-add-task'>+</span><textarea rows='1' type='text' autofocus='autofocus' placeholder='添加子任务'></textarea></li>
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

  _renderCheckbox: (el_array)->
    el_array.each((index, el)->
      $el = $(el)
      simple.checkbox
        el: $el
        size: $el.data('size')
        animation: $el.data('animation')
    )

  _bind: ->
    @subtasks.on 'checked', '.task .simple-checkbox', (e)=>
      $li = $(e.currentTarget).parent('li.task')
      task = $li.data('task')
      task.complete = true
      $li.addClass('complete').data('task', task).find('textarea').attr('disabled', 'true')
      @_triggerEvent 'complete', $li

    .on 'unchecked', '.task .simple-checkbox', (e)=>
      $li = $(e.currentTarget).parent('li.task')
      task = $li.data('task')
      task.complete = false
      $li.removeClass('complete').data('task', task).find('textarea').removeAttr('disabled')
      @_triggerEvent 'reopen', $li

    .on 'keyup', '.add.task textarea', (e)=>
      return unless e.which == 13
      new_task = 
        'complete': false
        'desc': $(e.currentTarget).val()
      $li = @addTask(new_task)
      $li.data('task', new_task)
      @subtasks.find('.add.task textarea').val('').focus()
      @_triggerEvent 'create', $li

    .on 'keyup', '.task:not(.add) textarea', (e)=>
      return unless e.which == 13
      $input = $(e.currentTarget)
      $li = $input.parent('li.task')
      task = $li.data('task')
      task.desc = $input.val()
      $li.data 'task', task
      @_triggerEvent 'edit', $li

    .on 'click', '.task .icon-remove-task', (e)=>
      $li = $(e.currentTarget).parent('li.task')
      if @opts.beforeRemove and typeof @opts.beforeRemove is 'function'
        @opts.beforeRemove($li, $li.data('task'), =>
          @removeTask($li)
        )
      else
        @removeTask($li)

  _triggerEvent: (type, $li)->
    @trigger type, 
      'li': $li
      'task': $li.data('task')
    @trigger 'update', 
      'type': type
      'li': $li
      'task': $li.data('task')

  setTasks: (tasks)->
    throw new Error "simple-subtasks: setTasks args must be Array" unless tasks instanceof Array
    @subtasks.find('ul').html('')
    for t in tasks
      @addTask(t)
    @

  getTasks: ->
    tasks = []
    @subtasks.find('li.task:not(.add)').each((index, li)->
      tasks.push $(li).data('task')
    )
    tasks

  addTask: (task)->
    $li = $("<li class='task'><input type='checkbox' /><textarea rows='1'>#{task.desc}</textarea><span class='icon-remove-task'>×</span></li>")
    $li.data('task', task)
    if task.complete
      $li.addClass('complete').find("input[type='checkbox']").attr('checked', true)
    $li.insertBefore @add_textarea
    @_renderCheckbox($li.find('input[type=checkbox]'))
    $li

  removeTask: ($li)->
    # 先触发事件后删除, 否则 data取不到参数
    @_triggerEvent 'remove', $li
    $li.remove()

  destroy: ->
    @subtasks.remove()

subtasks = (opts) ->
  new Subtasks(opts)
