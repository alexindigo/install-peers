// do it inline in sync way
// to make it work in non-npm environment
var npmModule
  , path = require('path')
  ;

if (process.env['npm_execpath'] && process.env['npm_execpath'].match(/\/node_modules\/npm\/bin\/npm-cli\.js$/)) {
  npmModule = require(path.resolve(process.env['npm_execpath'], '..', '..'));
}

// if no npm module found, don't expose any function
// to allow upstream modules find alternatives
module.exports = null;

if (npmModule) {
  module.exports = function(packages, options, done) {
    npmModule.load(options, function() {
      npmModule.commands.install(packages, done);
    });
  }
}
