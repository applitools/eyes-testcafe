'use strict';
const isTestcafeSelector = require('./isTestcafeSelector');
const makeToEyesSelector = require('./makeToEyesSelector');
const {TypeUtils} = require('@applitools/eyes-common');

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
  for (let propNAme of ['ignore', 'floating', 'layout', 'strict', 'content', 'accessibility']) {
    handleArrayProperty(propNAme);
  }
  await Promise.all(promises);

  function handleArrayProperty(propName) {
    if (!args[propName]) {
      return;
    }
    if (!TypeUtils.isArray(args[propName])) {
      args[propName] = [args[propName]];
    }
    args[propName].forEach((region, i) => {
      if (isTestcafeSelector(region.selector)) {
        logger.log(`converting {${propName}}`);
        p = testcafeSelectorToEyesSelector(region.selector).then(
          res => (args[propName][i].selector = res),
        );
        promises.push(p);
      }
    });
  }
}

module.exports = convertSelectors;
