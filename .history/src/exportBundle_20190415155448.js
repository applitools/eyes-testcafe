'use strict';
// This rollup plugin is meant to take the defined function
// of __processPageAndSerialize and export it so we can then babel it and require it.

module.exports = {
  generateBundle: function(_outputOptions, bundle, _isWrite) {
    const bundleFile = bundle['TMP_processPageAndSerialize'];

    bundleFile.code = `
    module.exports = () => {
      ${bundleFile.code}
      return ${filename}.apply(this, arguments);
    }
    `;
  },
};
