'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const {generateBundle} = require('../../src/prepareForClientFunctionPlugin');

describe('prepareForClientFunctionPlugin', () => {
  const transpile = str => {
    const bundleFile = {code: str};
    generateBundle(undefined, {'processPageAndSerialize.js': bundleFile});
    return bundleFile.code;
  };

  it('works with space before token', async () => {
    ['Symbol', 'Array', 'Set', 'Object', 'Map'].forEach(token => {
      const result = transpile(`let i = new ${token};`);
      expect(result).to.equal(`let i = new window.${token};`);
    });
  });

  it('works with functions calls', async () => {
    ['Symbol', 'Array', 'Set', 'Object', 'Map'].forEach(token => {
      let result = transpile(`foo(${token}.some());`);
      expect(result).to.equal(`foo(window.${token}.some());`);

      result = transpile(`foo(var1, ${token}.some());`);
      expect(result).to.equal(`foo(var1, window.${token}.some());`);
    });
  });

  it('works comments', async () => {
    ['Symbol', 'Array', 'Set', 'Object', 'Map'].forEach(token => {
      let result = transpile(`SOME COMMENT */${token}.some());`);
      expect(result).to.equal(`SOME COMMENT */window.${token}.some());`);
    });
  });

  it('does not replace object keys', async () => {
    ['Symbol', 'Array', 'Set', 'Object', 'Map'].forEach(token => {
      let result = transpile(`let i = { ${token}: value };`);
      expect(result).to.equal(`let i = { ${token}: value };`);
    });
  });
});
