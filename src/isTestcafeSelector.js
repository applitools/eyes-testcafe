'use strict';

function isTestcafeSelector(obj) {
  return !!(obj && obj.addCustomMethods && obj.find && obj.parent);
}

module.exports = isTestcafeSelector;
