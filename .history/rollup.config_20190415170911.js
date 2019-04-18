import babel from 'rollup-plugin-babel';
const path = require('path')
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapeAndExportBundle = require('./src/wrapeAndExportBundle');

const processPageAndSerializePath = path.resolve(__dirname, )
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
    babel({
      exclude: 'node_modules/**', 
      plugins: ["@babel/plugin-transform-spread"] 
    })
  ]
};