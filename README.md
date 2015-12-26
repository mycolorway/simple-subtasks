# Simple Subtasks
[![Circle CI](https://circleci.com/gh/mycolorway/simple-subtasks.svg?style=svg)](https://circleci.com/gh/mycolorway/simple-subtasks)

一个基于 [Simple Module](https://github.com/mycolorway/simple-module) 的 Todo 插件

[example](http://mycolorway.github.io/simple-subtasks/)

### 如何使用

#### 下载并引用

通过 `bower install` 下载依赖的第三方库，然后在页面中引入这些文件：

```html
<link media="all" rel="stylesheet" type="text/css" href="vendor/bower/simple-checkbox/styles/checkbox.css" />
<link media="all" rel="stylesheet" type="text/css" href="styles/subtasks.css" />

<script type="text/javascript" src="vendor/bower/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="vendor/bower/simple-module/lib/module.js"></script>
<script type="text/javascript" src="vendor/bower/simple-util/lib/util.js"></script>
<script type="text/javascript" src="vendor/bower/simple-checkbox/lib/checkbox.js"></script>
<script type="text/javascript" src="lib/subtasks.js"></script>
```

#### 初始化配置

使用simple-subtasks时，需要指定一个父节点作为参数：

```javascript
var subtasks = simple.subtasks({
    el: $("#subtasks"),
    size: 22,
    animation: true,
    beforeRemove: function(el, task, remove_task) {
        var is_remove = confirm('确定要删除吗？');
        if(is_remove) {
            remove_task();
        }
    }
});
```

### 方法和事件

#### 方法

***setTasks(tasks)***

初始化组件中的 Task。

```javascript
var data = [{
    'complete': false,
    'desc': '一个没有完成的子任务'
}, {
    'complete': true,
    'desc': '一个已经完成了的子任务'
}];

subtasks.setTasks(data);
```

***addTask(task)***

增加一条task

```javascript
var task = {
    'complete': false,
    'desc': '一个新的子任务'
}

subtasks.addTask(task);
```

***addTasks(tasks)***

增加多条task

```javascript
var tasks = [{
    'complete': false,
    'desc': '一个新的子任务'
}, {
    'complete': true,
    'desc': '另一个新的子任务'
}];

subtasks.addTasks(tasks);
```

***removeTask($task)***

删除一条task

```javascript
var $task = null;
subtasks.el.find('.task:not(.add)').each(function(indexm, task_el) {
  var task;
  task = $(task_el).data('task');
  if (task.desc === desc) {
    return $task = task_el;
  }
});
subtasks.removeTask($task)
```

***getTasks()***

获取现在组件中的所有 Tasks

```
subtasks.getTasks()
```

***destroy()***

销毁组件

```
subtasks.destroy()
```

#### 事件

参数: 
- event: 一个Jquery Event对象
- params: 
    - type: 触发事件的操作类型
    - element: 触发事件的 DOM 对象
    - task: 变动后的 task 对象

***update***

任何数据的更新都会触发 update 事件

***complete***

完成一个 task 时触发

***reopen***

重新打开一个 task 时触发

***create***

新增一个(或多个) task 时触发

注意: 直接调用 addTask 与 addTasks 方法 不会触发 create 事件

***edit***

修改 task 的 desc 时会触发

***remove***

删除 task 时会触发

