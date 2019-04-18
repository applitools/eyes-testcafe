import buble from 'rollup-plugin-buble';
const path = require('path')

const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dom-snapshot/dist/processPageAndSerialize')

module.exports = [{
  entry: 'src/scripts/main.js',
  dest: 'build/js/main.min.js',
  format: 'iife',
  sourceMap: 'inline',
}
{
  entery: processPageAndSerializePath,
  output: {
    file: 'src/processPageAndSerialize.js',
    format: 'cjs',
    name: 'processPageAndSerialize',
  },
  plugins: [ 
    buble({exclude: 'node_modules/**' })
  ]
}];