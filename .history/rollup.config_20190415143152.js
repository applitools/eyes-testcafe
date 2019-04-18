import buble from 'rollup-plugin-buble';
const path = require('path')

const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dist/processPageAndSerialize')

module.exports = [{
  input: inputFileName,
  output: {
    file: processPageAndSerializePath,
    format: 'cjs',
    name: 'src/processPageAndSerialize.js',
  },
  plugins: [ buble() ]
  plugins: [
  ],
}];