'use strict';

const {describe, it} = require('mocha');
// const {expect} = require('chai');
// const makeClientFunctionWrapper = require('../../src/makeClientFunctionWrapper');

// We get testcafe error in e2e run saying ClientFunction is executed outside of a test context
// Even if we pass ClientFunction to the makeClientFunctionWrapper from outside we get this error.
// As long as we require makeClientFunctionWrapper here we get that error.
describe.skip('makeClientFunctionWrapper', () => {
  // const clientFunctionWrapper = makeClientFunctionWrapper({
  //   clientFunctionExecuter: fn => (...args) => fn(...args),
  //   maxObjectSize: 3,
  //   window: {},
  // });

  it('works', async () => {
    // const getResult = await clientFunctionWrapper(async () => ({
    //   message: 'hello this is a string of some length',
    // }));
    // expect(await getResult()).to.deep.eql({
    //   message: 'hello this is a string of some length',
    // });
  });
});
