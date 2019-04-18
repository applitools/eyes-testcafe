'use strict';
import {ClientFunction} from 'testcafe';
const processPageAndSerialize = require('../dist/processPageAndSerialize');

fixture`Local Test`.page`http://localhost`;

test('My Local Page Test', async t => {
  const result = await ClientFunction(processPageAndSerialize)();
});
