function increase() {
  var elem = event.target;
  var height = elem.scrollTop;
  elem.style.height = elem.clientHeight + height + 'px';
  elem.scrollTo(elem.style.height);
}

module.exports = increase;