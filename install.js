var fs         = require('fs')
  , path       = require('path')
  , installNpm = require('./install-npm.js')

  , rootPath  = path.resolve(__dirname, '..', '..')

  , defaultPeerInstallOptions = {
    'no-save': true
  }
  ;

// in npm@3+ preinstall happens in `node_modules/.staging` folder
// so if we ended up in `node_modules/` jump one level up
if (path.basename(rootPath) === 'node_modules') {
  rootPath = path.resolve(rootPath, '..');
}

installPeerDeps();

// --- Subroutines

function installPeerDeps() {
  getPackageConfig(rootPath, function(config) {
    var peerDeps           = getPeerDeps(config)
      , peerInstallOptions = getPeerInstallOptions(config)
      ;

    if (!peerDeps) {
      console.error('Unable to find peerDependencies in ' + rootPath);
      return;
    }

    // ready to install, switch directories
    process.chdir(rootPath);

    // TODO: Add alternatives
    if (installNpm) {
      installNpm(peerDeps, peerInstallOptions);
    }
  });
}

function getPeerDeps(config) {
  var peerDeps;

  if (typeof config.peerDependencies === 'object' && !Array.isArray(config.peerDependencies)) {
    peerDeps = Object.keys(config.peerDependencies).map(function(name) {
      return name + '@' + config.peerDependencies[name];
    });
  }

  return peerDeps;
}

function getPeerInstallOptions(config) {
  var peerInstallOptions = defaultPeerInstallOptions;

  if (typeof config.peerInstallOptions === 'object' && !Array.isArray(config.peerInstallOptions)) {
    Object.keys(config.peerInstallOptions).forEach(function(key) {
      peerInstallOptions[key] = config.peerInstallOptions[key];
    });
  }

  return peerInstallOptions;
}

function getPackageConfig(packagePath, callback) {
  var packageFile = path.join(packagePath, 'package.json')
    , config
    ;

  fs.readFile(packageFile, 'utf-8', function(error, content) {
    if (error || !content) {
      console.error('Unable to read ' + packageFile + ':', error || 'no content');
      return;
    }

    config = parseConfig(content);

    if (config.isParseConfigFailed) {
      console.error('Unable to parse ' + packageFile + ':', config.error);
      return;
    }

    callback(config);
  });
}

function parseConfig(config) {
  try {
      config = JSON.parse(config);
  } catch (error) {
      config = {isParseConfigFailed: true, error: error};
  }

  return config;
}
