# AB test Middleware

[![NPM Version][npm-version-image]][npm-url]

AB test Middleware for Nextjs

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install nextjs-ab-test-middleware
```

## API

<!-- eslint-disable no-unused-vars -->

```js
var activateAB = require("nextjs-ab-test-middleware");
```

### activateAB(req, res, next, experiments)

### Sample usage

Sample app that will use custom token formats. This adds an ID to all requests and displays it using the `:id` token.

```js
var express = require("express");
const next = require("next");
var activateAB = require("nextjs-ab-test-middleware");

const experiment = [
  {
    name: "experiment-1",
    variants: [
      {
        id: "a",
        weight: 50,
      },
      {
        id: "b",
        weight: 50,
      },
    ],
    customFilter(req, res) {
      return req.originalUrl.indexOf("US") !== -1;
    },
  },
  {
    name: "experiment-2",
    variants(req, res) {
      if (req.originalUrl.indexOf("US") !== -1) {
        return [
          {
            id: "a",
            weight: 50,
          },
          {
            id: "b",
            weight: 50,
          },
        ];
      }
      return [
        {
          id: "a",
          weight: 100,
        },
        {
          id: "b",
          weight: 0,
        },
      ];
    },
  },
];
const app = next({ dev });

app
  .prepare()
  .then(() => {
    const server = express();

    server.use((req, res, next) => activateAB(req, res, next, experiment));

    server.use((req, res, next) => {
      next();
    });

    server.listen(3000, (err) => {
      if (err) throw err;
    });
  })
  .catch((ex) => {
    console.error(ex.stack); // eslint-disable-line no-console
    process.exit(1);
  });
```

## License

[MIT](LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/nextjs-ab-test-middleware
[npm-url]: https://npmjs.org/package/nextjs-ab-test-middleware
[npm-version-image]: https://badgen.net/npm/v/nextjs-ab-test-middleware
