var fs          = require('fs')
  , path        = require('path')
  , installNpm  = require('./install-npm.js')
  , installYarn = require('./install-yarn.js')

  , rootPath    = process.env.INIT_CWD || path.resolve(process.cwd(), '..', '..')

  , envLabel    = 'skip_install_peers_as_dev'

  , defaultPeerInstallOptions = {
    'save': false,
    'save-bundle': false,
    'save-dev': false,
    'save-optional': false,
    'save-prod': false
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

  // check for the "kill switch"
  if (process.env[envLabel]) {
    console.log('Skipping installing peerDependencies as devDependencies.');
    return;
  }

  // yo, do not install peers while installing peers
  process.env[envLabel] = '1';

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

    // TODO: Add more alternatives
    // TODO: Handle `peerInstallOptions` for npm and yarn
    if (installYarn) {
      installYarn(peerDeps, peerInstallOptions, installDone.bind(null, 'yarn'));
    } else if (installNpm) {
      installNpm(peerDeps, peerInstallOptions, installDone.bind(null, 'npm'));
    } else {
      console.error('Did not find a viable package manager to install dependencies with.');
    }
  });
}

function installDone(tool, result) {
  // cleanup env
  process.env[envLabel] = '';

  console.log('Installed peerDependencies as devDependencies via ' + tool + '.');

  console.log(result);
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
