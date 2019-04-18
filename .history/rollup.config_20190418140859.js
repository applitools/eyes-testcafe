import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapeAndExportPlugin = require('./src/wrapeAndExportPlugin');

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
      plugins: ['@babel/plugin-transform-spread'],
    }),
    replace({
      Symbol: Window.Symbol,
    }),
    wrapeAndExportPlugin,
  ],
};
