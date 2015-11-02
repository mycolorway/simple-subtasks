pointTo = null

beforeEach ->
  pointTo = $("<div />", {
    html: "hello"
  }).appendTo("body")



describe 'basic usage', ->
  it 'displayed', ->
    popover= simple.popover
      pointTo: pointTo
      content: "world"

    expect($("body > .simple-popover").length).toBe(1)


  it "unique", ->
    popover = simple.popover
      pointTo: pointTo
      content: "world"

    popover = simple.popover
      pointTo: pointTo
      content: "good"

    expect($("body > .simple-popover").length).toBe(1)


  it "autohide false", ->
    popover= simple.popover
      pointTo: pointTo
      content: "world"
      autohide: false

    $(document).click()
    expect($("body > .simple-popover").length).toBe(1)


  it "autohide true", ->
    popover = simple.popover
      pointTo: pointTo
      content: "world"
      autohide: true

    popover.el.trigger("mousedown")
    expect($("body > .simple-popover").length).toBe(1)

    $(document).trigger("mousedown")
    expect($("body > .simple-popover").length).toBe(0)




describe "destroy", ->
  it "destroyAll is ok when pointTo has removed", ->
    popover= simple.popover
      pointTo: pointTo
      content: "world"

    pointTo.remove()
    expect($("body > .simple-popover").length).toBe(1)

    simple.popover.destroyAll()
    expect($("body > .simple-popover").length).toBe(0)
