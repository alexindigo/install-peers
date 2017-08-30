# install-peers

Automatically installs project's peerDependencies (as devDependencies). Works with `npm`, `yarn` and `nvm`.

## Install

### npm

```
$ npm install --save-dev --ignore-scripts install-peers
```

### yarn

```
$ yarn add --dev --ignore-scripts install-peers
```

## Usage

Run `npm install` (or `yarn install`) to install `prod` and `dev`, as well as `peer` dependencies.

_You still may see "unmet peer dependency" warnings, due to installation flow of npm/yarn._

Also it won't update lock (shrinkwrap) files or modify package.json, keeping your setup pure and clean.

## License

Install-Peers is released under the MIT license.
