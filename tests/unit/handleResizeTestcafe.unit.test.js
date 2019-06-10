'use strict';

const {describe, it, afterEach} = require('mocha');
const {expect} = require('chai');
const makeHandleResizeTestcafe = require('../../src/makeHandleResizeTestcafe');

describe('initDefaultConfig', () => {
  const defaultViewport = {height: 123, width: 456};
  let width, height;
  const t = {
    resizeWindow: async (w, h) => {
      (width = w), (height = h);
    },
  };
  const handleResizeTestcafe = makeHandleResizeTestcafe({
    logger: console,
    defaultViewport,
  });

  afterEach(() => {
    width = undefined;
    height = undefined;
  });

  it('works', async () => {
    const browser = [{height: 789, width: 888, name: 'firefox'}];
    await handleResizeTestcafe(browser, t);
    expect(width).to.eq(888);
    expect(height).to.eq(789);
  });

  it('does not set size for multiple browser sizes ', async () => {
    const browser = [{deviceName: 'iPhone X'}, {deviceName: 'iPad'}];
    await handleResizeTestcafe(browser, t);
    expect(width).to.eq(undefined);
    expect(height).to.eq(undefined);
  });

  it('does not set size for multiple device sizes ', async () => {
    const browser = [
      {height: 789, width: 888, name: 'firefox'},
      {height: 789, width: 887, name: 'firefox'},
    ];
    await handleResizeTestcafe(browser, t);
    expect(width).to.eq(undefined);
    expect(height).to.eq(undefined);
  });

  it('resizes for more then 1 browser if all sizes are the same ', async () => {
    const browser = [
      {height: 789, width: 888, name: 'firefox'},
      {height: 789, width: 888, name: 'chrome'},
    ];
    await handleResizeTestcafe(browser, t);
    expect(width).to.eq(888);
    expect(height).to.eq(789);
  });

  it('works for 1 object browser', async () => {
    const browser = {height: 789, width: 888, name: 'firefox'};
    await handleResizeTestcafe(browser, t);
    expect(width).to.eq(888);
    expect(height).to.eq(789);
  });

  it('works for no browser - sets default size', async () => {
    await handleResizeTestcafe(undefined, t);
    expect(width).to.eq(defaultViewport.width);
    expect(height).to.eq(defaultViewport.height);
  });
});
