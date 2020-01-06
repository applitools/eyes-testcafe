'use strict';
const isTestcafeSelector = require('./isTestcafeSelector');
const makeToEyesSelector = require('./makeToEyesSelector');
const {TypeUtils} = require('@applitools/eyes-sdk-core');

async function convertSelectors({args, t, logger}) {
  if (!args) return;
  const testcafeSelectorToEyesSelector = makeToEyesSelector(t);
  const promises = [];
  let p;

  if (args.target === 'region') {
    if (isTestcafeSelector(args.selector)) {
      logger.log('converting {target:region, selector}');
      p = testcafeSelectorToEyesSelector(args.selector).then(res => (args.selector = res));
      promises.push(p);
    }
  }
  for (let propName of ['ignore', 'floating', 'layout', 'strict', 'content', 'accessibility']) {
    handleArrayProperty(propName);
  }
  await Promise.all(promises);

  function handleArrayProperty(propName) {
    if (!args[propName]) {
      return;
    }
    if (!TypeUtils.isArray(args[propName])) {
      args[propName] = [args[propName]];
    }

    const testcafeSelectors = args[propName].filter(r => isTestcafeSelector(r.selector));
    for (const region of testcafeSelectors) {
      logger.log(`converting {${propName}}`);
      p = testcafeSelectorToEyesSelector(region.selector).then(res => (region.selector = res));
      promises.push(p);
    }
  }
}

module.exports = convertSelectors;
