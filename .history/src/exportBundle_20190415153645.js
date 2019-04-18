'use strict';
// This rollup plugin is meant to take the defined function 
function exportBundle() {
  return {
    generateBundle: function(_outputOptions, bundle, _isWrite) {
      const bundleFile = bundle['processPageAndSerialize.js'];

      bundleFile.code = `
      ${bundleFile.code}
      module.exports = __processPageAndSerialize
      `;
    },
  };
}

module.exports = wrapBundle;
