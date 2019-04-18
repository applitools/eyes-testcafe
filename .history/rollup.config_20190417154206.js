import babel from 'rollup-plugin-babel';
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapeAndExportBundle = require('./src/wrapeAndExportBundle');
const polyfill = require('rollup-plugin-polyfill')

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
    polyfill('node_modules/@applitools/dom-snapshot/src/browser/processPageAndSerialize.js', ['./']),
    babel({
      plugins: ['@babel/plugin-transform-spread'],
    }),
    wrapeAndExportBundle,
  ],
};
