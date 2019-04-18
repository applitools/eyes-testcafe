import buble from 'rollup-plugin-buble';
const path = require('path')

const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dom-snapshot/dist/processPageAndSerialize')

module.exports = {
  entery: processPageAndSerializePath,
  dest: 'src/processPageAndSerialize.js',
  format: 'cjs',
  // sourceMap: 'inline',
  plugins: [ 
    buble({exclude: 'node_modules/**' })
  ]
};