'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeClientFunctionWrapper = require('../../src/makeClientFunctionWrapper');

describe('makeClientFunctionWrapper', () => {
  const clientFunctionWrapper = makeClientFunctionWrapper({
    clientFunctionExecuter: fn => ({
      with: () => (...args) => fn(...args),
    }),
    maxObjectSize: 3,
    window: {},
    logger: {log: () => {}},
  });

  it('works', async () => {
    const getResult = await clientFunctionWrapper(
      async () => ({
        message: 'hello this is a string of some length',
      }),
      {functionArgs: []},
    );
    expect(await getResult()).to.eql({
      message: 'hello this is a string of some length',
    });
  });
  it('can pass functionArgs', async () => {
    const functionArgs = [{dontFetchResources: true}];
    const getResult = await clientFunctionWrapper(
      async function() {
        return arguments[0];
      },
      {
        functionArgs,
      },
    );
    expect(await getResult()).to.eql(functionArgs);
  });
});
