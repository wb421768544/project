function throttling (clear, self, bool) {
  clearTimeout(clear[0]);
  clear[0] = setTimeout(() => {
    self.show = bool;
  }, 200);
}

module.exports = throttling;