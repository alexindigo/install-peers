# install-peers

Automatically installs project's peerDependencies (as devDependencies).

## Install

```
$ npm install --save-dev install-peers
```

## Usage

When saved as devDependency in your package, it will be installed for development installation,
bringing along modules listed in your project's peerDependencies.

It won't update lock (shrinkwrap) files or modify package.json, keeping your setup pure and clean.

Automatically works with `npm`, `yarn` and `nvm`.

## License

Install-Peers is released under the MIT license.
