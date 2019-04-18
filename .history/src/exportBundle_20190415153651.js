'use strict';
// This rollup plugin is meant to take the defined function of __processPageAndSerialize and 
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
