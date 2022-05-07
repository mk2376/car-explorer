# Installation

```bash

sudo npm install -g typescript
sudo npm install -g @quasar/cli
quasar ext add @quasar/qenv

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

## Environment variables

To pass ENV-variables into Quasar follow [this guide](https://0xhagen.medium.com/how-to-pass-env-variables-into-quasar-framework-application-c5acc6ad09a2).

Before running quasar, select environment defined in `.quasar.env.json`.

Example for development environment:

```bash

QENV=development

```

Example for production environment:

```bash

QENV=production

```

After that, you can run `quasar` commands as usual.
