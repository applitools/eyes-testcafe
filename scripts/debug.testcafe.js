/* global fixture, test */
const {ClientFunction} = require('testcafe');
const processPageAndSerialize = require('../dist/processPageAndSerialize');

const url = 'https://applitools.com/helloworld';
fixture`TestCafeDebug`.page(url);

/*
 * Run this incase of transpiling errors in processPageAndSerialize,
 * this shows logs for where the script failed.
 */
test('DEBUG SCRIPT', async _t => {
  const func = ClientFunction(processPageAndSerialize);
  await func();
});
