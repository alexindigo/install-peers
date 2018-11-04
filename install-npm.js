// do it inline in sync way
// to make it work in non-npm environment
var npmBin
  , executioner
  , path = require('path')
  , node = process.argv[0]
  ;

if (process.env['npm_execpath']) {
  var execPath = process.env['npm_execpath'];
  var expectedPath = path.join('bin', 'npm-cli.js');

  if (execPath.slice(-1 * expectedPath.length) === expectedPath) {
    npmBin = path.resolve(execPath);
  }
}

// if no npm module found, don't expose any function
// to allow upstream modules find alternatives
module.exports = null;

if (npmBin) {
  executioner = require('executioner');

  module.exports = function(packages, config, done) {
    var options = {
      node    : node,
      npm     : npmBin,
      // escape package name@versions
      packages: packages.map((pkg) => '"' + pkg + '"').join(' ')
    };

    executioner('"${node}" "${npm}" install --no-save --no-package-lock ${packages}', options, function (error, result) {
      if (error) {
        console.error('Unable to install peerDependencies', error);
        process.exit(1);
        return;
      }
      done(result);
    });
  }
}
