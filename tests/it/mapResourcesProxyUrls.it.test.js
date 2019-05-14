'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getProxyUrl = require('../../src/getProxyUrl');
const collectFrameData = require('../../src/collectFrameData');
const makeMapProxyUrls = require('../../src/makeMapProxyUrls');
const mapProxyUrls = makeMapProxyUrls({collectFrameData, getProxyUrl});

describe('mapProxyUrls', () => {
  const frame = {
    cdt: [
      {
        nodeType: 3,
        nodeValue:
          '/*hammerhead|stylesheet-http://localhost:2020/ftftft/http://tested-page-in-cdt.com',
        _shouldMap: true,
      },
      {
        nodeType: 2,
        nodeValue: '/*hammerhead|stylesheet-http://localhost:2020/ftftft/http://dont-map.com',
      },
      {
        nodeType: 3,
        nodeValue: '/*hammerhead-BAD-|stylesheet-http://localhost:2020/ftftft/http://dont-map.com',
      },
    ],
    blobs: [
      {
        url: 'main.css',
        type: 'text/css',
        value: Buffer.from(
          'yo-hello-yohttp://localhost:2020/ftftft/https://tested-page.com/hello?yo=true\nblabla',
        ),
        _shouldMap: true,
      },
      {
        url: 'dontMapMe.css',
        type: 'text/something-else',
        value: Buffer.from('yo-hello-yohttp://localhost:2020/ftftft/https://should-not-map.com/'),
      },
      {
        url: 'min.css',
        type: '  text/css  ',
        value: Buffer.from(
          'yo-hello-yo(http://localhost:2020/ftftft/https://tested-page-2.com)\naaahttp:localhost:2020/ftftft/https://tested-page-3.com/page',
        ),
        _shouldMap: true,
      },
    ],
    frames: [
      {
        cdt: [
          {
            nodeType: 3,
            nodeValue:
              '/*hammerhead|stylesheet-http://localhost:2020/ftftft/http://tested-page-in-cdt-frame.com',
            _shouldMap: true,
          },
          {
            nodeType: 2,
            nodeValue: '/*hammerhead|stylesheet-http://localhost:2020/ftftft/http://dont-map.com',
          },
        ],
        blobs: [
          {
            url: 'dontMapMeInFrame.css',
            type: 'text/something-else',
            value: Buffer.from('http://localhost:2020/ftftft/https://should-not-map-in-frame.com/'),
          },
          {
            url: 'min-frame.css',
            type: '  text/css  ',
            value: Buffer.from('http://localhost:2020/ftftft/http://tested-page-2-in-frame.com'),
            _shouldMap: true,
          },
        ],
        frames: [],
      },
    ],
  };

  it('works', () => {
    const actualFrame = cpyFrame();
    mapProxyUrls(actualFrame);
    assertBuffer(frame);
    assertMapping(actualFrame, frame);
  });

  it('dont throw if no proxy url and no resources for maaping', () => {
    let err = 'no error';
    try {
      mapProxyUrls({
        cdt: [],
        frames: [],
        blobs: [{url: 'hello', type: 'text/something', value: 'http://123.45.21.432:1212/adads'}],
      });
    } catch (e) {
      err = e;
    }
    expect(err).to.eq('no error');
  });

  function assertMapping(actualFrame, expectedFrame) {
    expect(actualFrame.blobs.map(b => b.value.toString())).to.deep.eql(
      expectedFrame.blobs.map(b =>
        !b._shouldMap
          ? b.value.toString()
          : b.value.toString().replace(/http:\/\/localhost:2020\/ftftft\//g, ''),
      ),
    );
    expect(actualFrame.cdt.map(n => n.nodeValue)).to.deep.eql(
      expectedFrame.cdt.map(n =>
        !n._shouldMap ? n.nodeValue : n.nodeValue.replace(/http:\/\/localhost:2020\/ftftft\//g, ''),
      ),
    );
    actualFrame.frames.forEach((f, i) => assertMapping(f, expectedFrame.frames[i]));
  }

  function assertBuffer(frame) {
    frame.blobs.forEach(b => expect(Buffer.isBuffer(b.value)).to.eq(true));
    frame.frames.forEach(assertBuffer);
  }

  function cpyFrame() {
    const cpyBlobs = blobs =>
      blobs.map(({url, value, type}) => ({
        url,
        value,
        type,
      }));
    const cpyCdt = cdt =>
      cdt.map(({nodeType, nodeValue}) => ({
        nodeType,
        nodeValue,
      }));
    return {
      blobs: cpyBlobs(frame.blobs),
      frames: [
        {
          cdt: cpyCdt(frame.frames[0].cdt),
          blobs: cpyBlobs(frame.frames[0].blobs),
          frames: [],
        },
      ],
      cdt: cpyCdt(frame.cdt),
    };
  }
});
