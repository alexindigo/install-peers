// do it inline in sync way
// to make it work in non-npm environment
var npmModule
  , path = require('path')
  ;

if (process.env['npm_execpath']) {
  npmModule = require(path.resolve(process.env['npm_execpath'], '..', '..'));
}

// if no npm module found, don't expose any function
// to allow upstream modules find alternatives
if (npmModule) {
  module.exports = function(packages, options) {
    npmModule.load(options, function() {
      npmModule.commands.install(packages, function() {
        console.log('Installed peerDependencies as devDependencies via npm.');
      });
    });
  }
}
