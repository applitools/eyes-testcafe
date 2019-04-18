import babel from 'rollup-plugin-babel';
const path = require('path')
const wrapBundle = require('./src/exportBundle');

// TODO - remove: the source should be with no wrapBundle (normal fucntion exported)
const processPageAndSerializePath = path.resolve(__dirname, './TMP_processPageAndSerialize')
// const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dom-snapshot/dist/processPageAndSerialize')

module.exports = {
  input: processPageAndSerializePath,
  output: {
    file: 'src/processPageAndSerialize.js',
    format: 'cjs',
    name: 'processPageAndSerialize',
  },
  plugins: [ 
    babel({
      exclude: 'node_modules/**', 
      plugins: ["@babel/plugin-transform-spread"] 
    })
  ]
};