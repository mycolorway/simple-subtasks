var pointTo;

pointTo = null;

beforeEach(function() {
  return pointTo = $("<div />", {
    html: "hello"
  }).appendTo("body");
});

describe('basic usage', function() {
  it('displayed', function() {
    var popover;
    popover = simple.popover({
      pointTo: pointTo,
      content: "world"
    });
    return expect($("body > .simple-popover").length).toBe(1);
  });
  it("unique", function() {
    var popover;
    popover = simple.popover({
      pointTo: pointTo,
      content: "world"
    });
    popover = simple.popover({
      pointTo: pointTo,
      content: "good"
    });
    return expect($("body > .simple-popover").length).toBe(1);
  });
  it("autohide false", function() {
    var popover;
    popover = simple.popover({
      pointTo: pointTo,
      content: "world",
      autohide: false
    });
    $(document).click();
    return expect($("body > .simple-popover").length).toBe(1);
  });
  return it("autohide true", function() {
    var popover;
    popover = simple.popover({
      pointTo: pointTo,
      content: "world",
      autohide: true
    });
    popover.el.trigger("mousedown");
    expect($("body > .simple-popover").length).toBe(1);
    $(document).trigger("mousedown");
    return expect($("body > .simple-popover").length).toBe(0);
  });
});

describe("destroy", function() {
  return it("destroyAll is ok when pointTo has removed", function() {
    var popover;
    popover = simple.popover({
      pointTo: pointTo,
      content: "world"
    });
    pointTo.remove();
    expect($("body > .simple-popover").length).toBe(1);
    simple.popover.destroyAll();
    return expect($("body > .simple-popover").length).toBe(0);
  });
});
