import buble from 'rollup-plugin-buble';
const path = require('path')

const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dist/processPageAndSerialize')

module.exports = [{
  input: processPageAndSerializePath,
  output: {
    file: 'src/processPageAndSerialize.js',
    format: 'cjs',
    name: 'src/processPageAndSerialize.js',
  },
  plugins: [ buble() ]
}];