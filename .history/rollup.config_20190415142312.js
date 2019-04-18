const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const wrapBundle = require('./src/wrapBundle');

const processPageConfig = config('src/browser/processPage.js', 'processPage');
const processPageAndSerializeConfig = config(
  'src/browser/processPageAndSerialize.js',
  'processPageAndSerialize',
);

module.exports = [{
  input: inputFileName,
  output: {
    file: `dist/${outputFileName}.js`,
    format: 'iife',
    name: outputFileName,
  },
  plugins: [
    resolve({}),
    commonjs({include: '**', ignoreGlobal: true}),
    builtins(),
    globals(),
    wrapBundle(outputFileName),
  ],
}];

function config(inputFileName, outputFileName) {
  return {
    input: inputFileName,
    output: {
      file: `dist/${outputFileName}.js`,
      format: 'iife',
      name: outputFileName,
    },
    plugins: [
      resolve({}),
      commonjs({include: '**', ignoreGlobal: true}),
      builtins(),
      globals(),
      wrapBundle(outputFileName),
    ],
  };
}
