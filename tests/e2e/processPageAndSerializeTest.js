/* global fixture, test */
'use strict';
const fs = require('fs');
const {promisify} = require('util');
const processPageAndSerialize = require('../../dist/processPageAndSerialize');
const clientFunctionExecutor = require('../../src/clientFunctionExecutor');
const writeFile = promisify(fs.writeFile);
const path = require('path');

fixture`processPageAndSerialize Test `.page`http://localhost:7272/basicCdt.html`;

test('Basic CDT test', async (/* t */) => {
  const processPageClientFunction = await clientFunctionExecutor({
    clientFunction: processPageAndSerialize,
  });
  const result = await processPageClientFunction();
  // const {error, warn, log} = await t.getBrowserConsoleMessages();
  // console.log('error', error);
  // console.log('warn', warn);
  // console.log('log', log);
  await writeFile(path.resolve(__dirname, './test-cdt.json'), JSON.stringify(result));
});
