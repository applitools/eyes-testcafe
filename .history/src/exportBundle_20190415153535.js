'use strict';
// This rollup plugin is meant to create a standalone function that can be consumed as a string and be sent to a remote browser for evaluation.
// I couldn't find a way in rollup to create an iife that runs the actual code (instead of returning a function that runs the code) without polluting the global scope
// So we're just wrapping the generated iife with a function that invokes the actual code that captures the DOM.

function exportBundle(filename) {
  return {
    generateBundle: function(_outputOptions, bundle, _isWrite) {
      const bundleFile = bundle[`${filename}.js`];

      bundleFile.code = `
function __${filename}() {
  ${bundleFile.code}
  module.exports = __processPageAndSerialize`;
    },
  };
}

module.exports = wrapBundle;
