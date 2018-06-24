function drop(elem, container) {
  var doc = document.documentElement;
  var src = {};
  elem.style.position = "absolute";
  elem.addEventListener("mousedown", function () {
    src.x = event.clientX - elem.offsetLeft; //相对位置
    src.y = event.clientY - elem.offsetTop;
    if (src.x > 320 && src.y > 270) {
      return;
    }
    event.preventDefault();
    doc.addEventListener("mousemove", move);
  });
  doc.addEventListener("mouseup", function () {
    doc.removeEventListener("mousemove", move);
  });
  function move() {
    var clientX = event.clientX,
      clientY = event.clientY;
    var left = clientX - src.x,
      top = clientY - src.y;
    var x = 0, y = 0;
    var len = container.clientWidth - elem.clientWidth - 5;
    if (left >= 0 && left <= len) {
      elem.style.left = (x = left) + "px";
    }
    if (top >= 0 && top <= len) {
      elem.style.top = (y = top) + "px";
    }
  }
}

module.exports = drop;
