'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getProxyUrl = require('../../src/getProxyUrl');

describe('getProxyUrl', () => {
  it('works with localhost', () => {
    const text =
      'blablahttp://localhost:5040/huhiuih/https://someurl.com/yo?a=3\nblablahttps://123.432.567.21:5050/huhiuih/https://someurl.com/yo?a=3';
    const proxyUrl = getProxyUrl(text);
    expect(proxyUrl).to.eql('http://localhost:5040/huhiuih/');
  });

  it('works with ip', () => {
    const text =
      'blablahttp://123.432.567.21:5050/huhiuih/https://someurl.com/yo?a=3\nblablahttps://123.432.567.21:5050/huhiuih/https://someurl.com/yo?a=3';
    const proxyUrl = getProxyUrl(text);
    expect(proxyUrl).to.eql('http://123.432.567.21:5050/huhiuih/');
  });

  it('works with localhost https', () => {
    const text =
      'blablahttps://localhost:5040/huhiuih/https://someurl.com/yo?a=3\nblablahttps://123.432.567.21:5050/huhiuih/https://someurl.com/yo?a=3';
    const proxyUrl = getProxyUrl(text);
    expect(proxyUrl).to.eql('https://localhost:5040/huhiuih/');
  });

  it('works with ip https', () => {
    const text =
      'blablahttps://123.432.567.21:5050/huhiuih/https://someurl.com/yo?a=3\nblablahttps://123.432.567.21:5050/huhiuih/https://someurl.com/yo?a=3';
    const proxyUrl = getProxyUrl(text);
    expect(proxyUrl).to.eql('https://123.432.567.21:5050/huhiuih/');
  });
});
