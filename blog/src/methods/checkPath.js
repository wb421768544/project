function checkPath(route) {
  var path = route.path;
  var i = path.indexOf('/', 1);
  var basePath = path.substring(0, i);
  switch(path) {
    case '/write': return false;
  }

  switch(basePath) {
    case '/edit': return false;
    default: return true;
  }
}

module.exports = checkPath;