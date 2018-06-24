function scroll(elem) {
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


module.exports = scroll;