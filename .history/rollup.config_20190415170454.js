import babel from 'rollup-plugin-babel';
const path = require('path')
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapeAndExportBundle = require('./src/wrapeAndExportBundle');
const wrapeAndExportBundle = require('@applitools/dom-snapshot/src/browser/');

// TODO - remove: the source should be with cjs and no wrapBundle (normal fucntion exported)
const processPageAndSerializePath = path.resolve(__dirname, './TMP_processPageAndSerialize.js')
const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dom-snapshot/')

module.exports = {
  input: processPageAndSerializePath,
  output: {
    file: 'src/processPageAndSerialize.js',
    format: 'cjs',
    name: 'processPageAndSerialize',
  },
  plugins: [
    resolve({}),
      commonjs({include: '**', ignoreGlobal: true}),
      builtins(),
      globals(),
    wrapeAndExportBundle,
    babel({
      exclude: 'node_modules/**', 
      plugins: ["@babel/plugin-transform-spread"] 
    })
  ]
};