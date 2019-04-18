import babel from 'rollup-plugin-babel';
const path = require('path')
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapeAndExportBundle = require('./src/wrapeAndExportBundle');

const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dom-snapshot/src/browser/processPageAndSerialize')
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
    // wrapeAndExportBundle,
    babel({
      exclude: 'node_modules/**', 
      exetntions: ["@babel/plugin-transform-spread"] 
    })
  ]
};