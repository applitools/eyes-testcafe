'use strict';
const fs = require('fs');
const {promisify} = require('util');
const processPageAndSerialize = require('../../dist/processPageAndSerialize');
const clientFunctionJsonWrapper = require('../../src/clientFunctionJsonWrapper');
const writeFile = promisify(fs.writeFile);

fixture`processPageAndSerialize Test `.page`http://localhost`;

test('Basic CDT test', async t => {
  const processPageClientFunction = await clientFunctionJsonWrapper(processPageAndSerialize);
  const result = await processPageClientFunction();
  await writeFile(`./cdt.json`, JSON.stringify(result));
});
