import babel from 'rollup-plugin-babel';
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const builtins = require('@joseph184/rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapeAndExportPlugin = require('./src/wrapeAndExportPlugin');
const prepareForClientFunctionPlugin = require('./src/prepareForClientFunctionPlugin');

// module.exports = {
//   input: 'node_modules/@applitools/dom-snapshot/src/browser/processPageAndSerialize.js',
//   output: {
//     file: 'dist/processPageAndSerialize.js',
//     format: 'iife',
//     name: 'processPageAndSerialize',
//   },
//   plugins: [
//     resolve({}),
//     commonjs({include: '**', ignoreGlobal: true}),
//     builtins(),
//     globals(),
//     json(),
//     babel({
//       plugins: ['@babel/plugin-transform-spread'],
//     }),
//     prepareForClientFunctionPlugin,
//     wrapeAndExportPlugin,
//   ],
// };
module.exports = {
  input: 'a.js',
  output: {
    file: 'dist/a.js',
    format: 'iife',
    name: 'a',
  },
  plugins: [
    resolve({}),
    commonjs({include: '**', ignoreGlobal: true}),
    builtins(),
    globals(),
    json(),
    babel({
      plugins: ['@babel/plugin-transform-spread'],
    }),
    prepareForClientFunctionPlugin('a'),
    wrapeAndExportPlugin('a'),
  ],
};
