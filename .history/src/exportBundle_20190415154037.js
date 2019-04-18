'use strict';
// This rollup plugin is meant to take the defined function
// of __processPageAndSerialize and export it so we can then babel it and require it.

module.exports = {
  generateBundle: function(_outputOptions, bundle, _isWrite) {
    console.log(11111)
    const bundleFile = bundle['processPageAndSerialize.js'];

    bundleFile.code = `
    ${bundleFile.code}
    module.exports = __processPageAndSerialize
    `;
  },
};
