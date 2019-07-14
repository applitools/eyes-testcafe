'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const {Selector} = require('testcafe');
const isTestcafeSelector = require('../../src/isTestcafeSelector');

describe('isTestcafeSelector', () => {
  it('works', () => {
    const res = isTestcafeSelector(Selector('.my-class'));
    expect(res).to.be.true;
  });
});
