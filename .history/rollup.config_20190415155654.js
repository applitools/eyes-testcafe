import babel from 'rollup-plugin-babel';
const path = require('path')
const exportBundle = require('./src/exportBundle');

// TODO - remove: the source should be with cjs and no wrapBundle (normal fucntion exported)
const processPageAndSerializePath = path.resolve(__dirname, './TMP_processPageAndSerialize.js')
// const processPageAndSerializePath = path.resolve(__dirname, 'node_modules/@applitools/dom-snapshot/dist/processPageAndSerialize')

module.exports = {
  input: processPageAndSerializePath,
  output: {
    file: 'src/processPageAndSerialize.js',
    format: 'iife',
    name: 'processPageAndSerialize',
  },
  plugins: [ 
    babel({
      exclude: 'node_modules/**', 
      plugins: [exportBundle, "@babel/plugin-transform-spread"] 
    })
  ]
};