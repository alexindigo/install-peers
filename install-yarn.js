// do it inline in sync way
// to make it work in non-npm environment
var yarnModule
  , executioner
  , path = require('path')
  , node = process.argv[0]
  ;

if (process.env['npm_execpath'] && process.env['npm_execpath'].match(/node_modules\/yarn\/bin\/yarn\.js$/)) {
  yarnModule = path.resolve(process.env['npm_execpath'], '..', '..', 'lib', 'cli');
}

// if no yarn module found, don't expose any function
// to allow upstream modules find alternatives
module.exports = null;

if (yarnModule) {

  executioner = require('executioner');

  module.exports = function(packages, extra, done) {

    var options = {
      node    : node,
      yarn    : yarnModule,
      // escape package names@versions
      packages: packages.map((pkg) => '"' + pkg + '"').join(' ')
    };

    executioner('${node} ${yarn} add --peer --no-lockfile ${packages}', options, function(error, result) {
      if (error) {
        console.error('Unable to install peerDependencies', error);
        process.exit(1);
        return;
      }
      done();
    });

    // Looks like yarn shows last line from the output of sub-scripts
    console.log('Installing peerDependencies as devDependencies...');
  };
}
