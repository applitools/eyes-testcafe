import babel from 'rollup-plugin-babel';
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapeAndExportBundle = require('./src/wrapeAndExportBundle');

module.exports = {
  input: 'node_modules/@applitools/dom-snapshot/src/browser/processPageAndSerialize.js',
  output: {
    file: 'src/processPageAndSerialize.js',
    format: 'iife',
    name: 'processPageAndSerialize',
  },
  plugins: [
    resolve({}),
    commonjs({include: '**', ignoreGlobal: true}),
    builtins(),
    globals(),
    babel({
      "presets": [
        ["env",
            {
                "modules": false,
                "targets": {
                    "chrome": "58",
                    "ie": "11"
                },
                "useBuiltIns": true, //enables babel and import babel into your inputFile.js
            }
        ]
    ],
      plugins: ['@babel/plugin-transform-spread'],
    }),
    wrapeAndExportBundle,
  ],
};
