class util {
  constructor() {

  }
  increase() {
    if(event && event.target == 'textarea') {
      console.log('true');
    }
  }
  parseCookie( cookie ) {
    var cookies = {};
    if( !cookie ){
        return cookies;
    }
    var list = cookie.split( ";" );
    for( let i = 0, len = list.length; i < len; i ++ ){
        let pair = list[i].split("=");
        cookies[pair[0].trim()] = pair[1];
    }
    return cookies;
  }

  throttling (clear, self, bool) {
    clearTimeout(clear[0]);
    clear[0] = setTimeout(() => {
      self.show = bool;
    }, 200);
  }

  scroll(elem) {
    var body = document.body;
    var top = body.scrollTop;
    var srcTop = elem.offsetTop;
    window.addEventListener('scroll', handleScroll, false);
  
    function handleScroll() {
      if(body.scrollTop != top) {
        elem.style.top = srcTop + body.scrollTop + 'px';
      }
      top = body.scrollTop;
    }
  }

  drop (elem, container) {
    if(!elem || elem.type != '') {
      return console.error('first argument must be a textarea element');
    }
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
  
};


exports = util;
 