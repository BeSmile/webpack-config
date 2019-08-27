var babel = require("@babel/core")

module.exports = function(source) {
  var babelOptions = {
    presets: ['env']
  }

  var result = babel.transform(source, babelOptions);
  console.log(result);
  return result.code;
}
