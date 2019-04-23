'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
// TODO - ClientFunction test this lines makes ClientFunction to fail on test context stuff.. even
// if we pass the ClientFunction as a makeClientFunctionExecutor args
// const makeClientFunctionExecutor = require('../../src/makeClientFunctionExecuter');

// describe.only('clientFunctionExecutor', () => {
//   const clientFunctionExecutor = Promise.resolve;
//   it('works', async () => {
//     // const clientFunction = () => return 'some result'
//     clientFunctionExecutor({clientFunctionExecutor});
//   });
// });
