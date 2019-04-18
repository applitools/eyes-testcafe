const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapBundle = require('./src/wrapBundle');
const path = require('path')

const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dist/processPageAndSerialize')

module.exports = [{
  input: inputFileName,
  output: {
    file: processPageAndSerializePath,
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