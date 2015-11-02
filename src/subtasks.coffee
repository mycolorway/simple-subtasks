class Popover extends SimpleModule

  opts:
    pointTo:             null
    content:             null
    position:            null
    offset:              null
    autohide:            true
    cls:                 null
    align:               "center"
    verticalAlign:       "middle"
    autoAdjustPosition:  true

  @_directions: [
    "direction-left-top"
    "direction-left-middle"
    "direction-left-bottom"
    "direction-right-top"
    "direction-right-bottom"
    "direction-right-middle"
    "direction-top-left"
    "direction-top-right"
    "direction-top-center"
    "direction-bottom-left"
    "direction-bottom-right"
    "direction-bottom-center"
  ]


  @_tpl:
    popover: """
      <div class="simple-popover">
        <div class="simple-popover-content"></div>
        <div class="simple-popover-arrow">
          <i class="arrow arrow-shadow-1"></i>
          <i class="arrow arrow-shadow-0"></i>
          <i class="arrow arrow-border"></i>
          <i class="arrow arrow-basic"></i>
        </div>
      </div>
    """


  _init: ->
    if @opts.pointTo is null
      throw "[Popover] - pointTo is not given"

    if @opts.content is null
      throw "[Popover] - content shouldn't be empty"

    Popover.destroyAll()
    @_render()
    @_bind()
    @el.data("popover", @)
    @refresh()


  _render: ->
    @el = $(Popover._tpl.popover).addClass @opts.cls
    @pointTo = @opts.pointTo
    @arrow = @el.find(".simple-popover-arrow")

    @el.find(".simple-popover-content").append(@opts.content)
    @el.appendTo("body")

    @pointTo.addClass("popover-pointTo")
      .data("popover", @)



  _bind: ->
    @el.on "click.simple-popover", ".simple-popover-destroy", (e) =>
      e.preventDefault()
      @destroy()

    if @opts.autohide
      $(document).on "mousedown.simple-popover", (e) =>
        target = $(e.target)

        if @triggerHandler("popover:beforeAutohide", [@, target]) is false
          return

        return if target.is(@pointTo) or @el.has(target).length or target.is(@el)

        @destroy()

    $(window).on "resize.simple-popover", =>
      @refresh()



  _unbind: ->
    @el.off(".simple-popover")
    $(document).off(".simple-popover")
    $(window).off(".simple-popover")



  destroy: ->
    if @triggerHandler("popover:beforeDestroy", [@]) is false
      return

    @_unbind()
    @el.remove()
    @pointTo.removeClass("popover-pointTo")
      .removeData("popover")

    @trigger("popover:destroy", [@])



  refresh: ->
    pointToOffset = @pointTo.offset()
    pointToWidth  = @pointTo.outerWidth()
    pointToHeight = @pointTo.outerHeight()

    winHeight = $(window).height()
    winWidth = $(window).width()

    popoverWidth  = @el.outerWidth()
    popoverHeight = @el.outerHeight()

    scrollTop  = $(document).scrollTop()
    scrollLeft = $(document).scrollLeft()

    arrowWidth  = @arrow.width()
    arrowHeight = @arrow.height()
    arrowOffset = 16

    top = 0
    left = 0

    directions = Popover._directions

    @el.removeClass(directions.join(" "))
    @arrow.css
      top: ''
      bottom: ''
      left: ''
      right: ''

    if @opts.position
      direction = "direction-#{ @opts.position }"

      if directions.indexOf(direction) is -1
        throw "[Popover] - position is not valid"

      @el.addClass(direction)
    else
      leftSpace = pointToOffset.left - scrollLeft
      rightSpace = scrollLeft + winWidth - pointToOffset.left - pointToWidth
      topSpace = pointToOffset.top - scrollTop
      bottomSpace = scrollTop + winHeight - pointToOffset.top - pointToHeight

      direction = ["right", "bottom"]
      verticalAlign = "top"

      if rightSpace < popoverWidth + arrowOffset and leftSpace > rightSpace and leftSpace > popoverWidth + arrowOffset
        direction[0] = "left"

      if topSpace > bottomSpace
        direction[1] = "top"
        verticalAlign = "bottom"

      @el.addClass("direction-#{ direction.join("-") }")

    # calculate popover position
    direction = @el.attr("class").match(/direction-([a-z]+)-([a-z]+)/).slice(1)

    switch direction[0]
      when "left"
        left = pointToOffset.left - arrowHeight - popoverWidth
      when "right"
        left = pointToOffset.left + pointToWidth + arrowHeight
      when "top"
        top = pointToOffset.top - arrowHeight - popoverHeight
      when "bottom"
        top = pointToOffset.top + pointToHeight + arrowHeight
      else
        break

    switch direction[1]
      when "top"
        top = pointToOffset.top + pointToHeight / 2 + arrowWidth / 2 + arrowOffset - popoverHeight
      when "bottom"
        top = pointToOffset.top + pointToHeight / 2 - arrowWidth / 2 - arrowOffset
      when "left"
        left = pointToOffset.left + pointToWidth / 2  + arrowWidth / 2 + arrowOffset - popoverWidth
      when "right"
        left = pointToOffset.left + pointToWidth / 2  - arrowWidth / 2 - arrowOffset
      when "center"
        left = pointToOffset.left + pointToWidth / 2  - popoverWidth / 2
      when "middle"
        top = pointToOffset.top + pointToHeight / 2  - popoverHeight / 2
      else
        break

    # set align
    if /top|bottom/.test direction[0]
      switch @opts.align
        when "left"
          left -= pointToWidth / 2
        when "right"
          left += pointToWidth / 2
        else
          break

    # set vertical align
    if /left|right/.test direction[0]
      switch @opts.verticalAlign
        when "top"
          top -= pointToHeight / 2
        when "bottom"
          top += pointToHeight / 2
        else
          break

    # auto adjust position if popover beyond browser view edge
    if @opts.autoAdjustPosition
      if /top|bottom/.test(direction[0]) and left < scrollLeft
        delta = scrollLeft - left
        left += delta

        switch direction[1]
          when "left"
            @arrow.css("right", arrowOffset + delta)
          when "right"
            @arrow.css("left", Math.max(arrowOffset - delta, arrowOffset))
          else
            @arrow.css("marginLeft", -arrowOffset / 2 - delta)

      if /left|right/.test(direction[0]) and top < scrollTop
        delta = scrollTop - top
        top += delta

        switch direction[1]
          when "top"
            @arrow.css("bottom", arrowOffset + delta)
          when "bottom"
            @arrow.css("top", Math.max(arrowOffset - delta, arrowOffset))
          else
            @arrow.css("marginTop", -arrowOffset / 2 - delta)

    # set offset
    if @opts.offset
      if @opts.offset.y
        if /top/.test(direction[0])
          top  -= @opts.offset.y
        else
          top  += @opts.offset.y

      if @opts.offset.x
        if /left/.test(direction[0])
          left -= @opts.offset.x
        else
          left += @opts.offset.x

    @el.css
      top: top
      left: left

  @destroyAll: ->
    $(".simple-popover").each ->
      $this = $(this)
      popover = $this.data("popover")

      if popover.pointTo.index() is -1
        $this.remove()
      else
        popover.destroy()

popover = (opts) ->
  new Popover(opts)

popover.destroyAll = Popover.destroyAll
