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
    <li><input type='checkbox' /></li>
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
    @add_input = $("<li class='add task'><span>+</span><input type='text' autofocus='autofocus' placeholder='添加子任务'/></li>")
    @subtasks.append(@add_input)
    @el.data 'subtasks', @subtasks
    .html @subtasks

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
      $(e.currentTarget).parent('li.task').addClass('complete')
    .on 'unchecked', '.task .simple-checkbox', (e)=>
      $(e.currentTarget).parent('li.task').removeClass('complete')
    .on 'keyup', '.add.task input[type=text]', (e)=>
      return unless e.which == 13
      new_task = 
        'complete': false
        'desc': $(e.currentTarget).val()
      $li = @addTask(new_task)
      @subtasks.find('.add.task input[type=text]').val('').focus()
      @triggerHandler 'add',
        'li': $li
        'task': new_task

    .on 'click', '.task .remove-task', (e)=>
      $li = $(e.currentTarget).parent('li.task')
      if @opts.beforeRemove and typeof @opts.beforeRemove is 'function'
        @opts.beforeRemove($li, $li.data('task'), =>
            @removeTask($li)
        )
      else
        @removeTask($li)

  setTasks: (tasks)->
    throw new Error "simple-subtasks: setTasks args must be Array" unless tasks instanceof Array
    @subtasks.find('ul').html('')
    for t in tasks
      @addTask(t)

  addTask: (task)->
    $li = $("<li class='task'><input type='checkbox' /><input type='text' value='#{task.desc}' /><span class='remove-task'>×</span></li>")
    $li.data('task', task)
    if task.complete
      $li.addClass('complete').find("input[type='checkbox']").attr('checked', true)
    $li.insertBefore @add_input
    @_renderCheckbox($li.find('input[type=checkbox]'))
    $li

  removeTask: ($li)->
    $li.remove()
    @subtasks.triggerHandler 'remove', 
      'li': $li
      'task': $li.data('task')

  destroy: ->


subtasks = (opts) ->
  new Subtasks(opts)
