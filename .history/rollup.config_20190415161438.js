import babel from 'rollup-plugin-babel';
const path = require('path')
const wrapeAndExportBundle = require('./src/wrapeAndExportBundle');

// TODO - remove: the source should be with cjs and no wrapBundle (normal fucntion exported)
const processPageAndSerializePath = path.resolve(__dirname, './TMP_processPageAndSerialize.js')
// const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dom-snapshot/dist/processPageAndSerialize')

module.exports = {
  input: processPageAndSerializePath,
  output: {
    file: 'src/processPageAndSerialize.js',
    format: 'cjs',
    name: 'processPageAndSerialize',
  },
  plugins: [ 
    wrapeAndExportBundle,
    babel({
      exclude: 'node_modules/**', 
      plugins: ["@babel/plugin-transform-spread"] 
    })
  ]
};