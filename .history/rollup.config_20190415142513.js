const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapBundle = require('./src/wrapBundle');

const processPageAndSerializeSource = require('@applitools/dom-snapshot')

module.exports = [{
  input: inputFileName,
  output: {
    file: 'src/processPageAndSerialize.js',
    format: 'cjs',
    name: 'src/processPageAndSerialize.js',
  },
  plugins: [
    resolve({}),
    commonjs({include: '**', ignoreGlobal: true}),
    builtins(),
    globals(),
    wrapBundle(outputFileName),
  ],
}];