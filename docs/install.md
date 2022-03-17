# Installation

```bash

sudo npm install -g typescript
sudo npm install -g @quasar/cli

npm install @babylonjs/core
npm install @babylonjs/loaders
npm install @babylonjs/inspector
npm install @babylonjs/gui

npm install --save ammojs-typed
npm install --save raw-loader

```

## Creating

```bash

quasar create

```

## Config

To prevent Node.js packages from misbehaving in non-Node environment add all problematic requirements in quasar.conf.js:

```json

module.exports = configure(function (ctx) {
  return {

    // ...

    build: {

      // ...

      extendWebpack(cfg) {
        cfg.resolve.fallback = { fs: false, path: false };
      },
    },

    // ...

  }
}

```
