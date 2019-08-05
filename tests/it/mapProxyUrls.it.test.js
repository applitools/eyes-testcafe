'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getProxyUrl = require('../../src/getProxyUrl');
const collectFrameData = require('../../src/collectFrameData');
const makeMapProxyUrls = require('../../src/makeMapProxyUrls');
const absolutizeUrl = require('../../src/absolutizeUrl');
const mapProxyUrls = makeMapProxyUrls({collectFrameData, getProxyUrl, logger: console});

describe('mapProxyUrls', () => {
  const frame = {
    cdt: [
      {
        nodeType: 1,
        nodeName: 'STYLE',
        attributes: [],
        childNodeIndexes: [1, 3],
      },
      {
        nodeType: 3,
        nodeValue: 'http://localhost:2020/ftftft/http://tested-page-in-cdt.com',
        _shouldMap: true,
      },
      {
        nodeType: 2,
        nodeValue: '/*hammerhead|stylesheet-http://localhost:2020/ftftft/http://dont-map.com',
      },
      {
        nodeType: 3,
        nodeValue: 'http://dont-map.com',
      },
      {
        nodeType: 1,
        attributes: [
          {
            name: 'style',
            value: 'some some url(http://localhost:2020/ftftft/http://attribute-style.com)',
            _shouldMap: true,
          },
          {
            name: 'style',
            value: 'some some url(http://dont-map-me.com)',
          },
        ],
      },
    ],
    url: 'https://some.com/main.html',
    blobs: [
      {
        url: 'http://localhost:2020/main.css', // partial mapping in blobs url
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
        url: 'http://localhost:2020/ftftft/https://tested-page-3.com/min.css',
        type: 'text/css  ',
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
            nodeType: 1,
            nodeName: 'STYLE',
            attributes: [],
            childNodeIndexes: [1],
          },
          {
            nodeType: 1,
            nodeName: 'STYLE',
            attributes: [],
            childNodeIndexes: [2],
          },
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
          {
            nodeType: 1,
            attributes: [
              {
                name: 'style',
                value:
                  'some some url(http://localhost:2020/ftftft/http://attribute-style-in-frame.com)',
                _shouldMap: true,
              },
              {
                name: 'style',
                value: 'some some url(http://dont-map-me-in-frame.com)',
              },
            ],
          },
        ],
        url: 'https://internal.com',
        blobs: [
          {
            url: 'dontMapMeInFrame.css',
            type: 'text/something-else',
            value: Buffer.from('http://localhost:2020/ftftft/https://should-not-map-in-frame.com/'),
          },
          {
            url: 'min-frame.css',
            type: 'text/css  ',
            value: Buffer.from('http://localhost:2020/ftftft/http://tested-page-2-in-frame.com'),
            _shouldMap: true,
          },
          {
            url: 'http://localhost:2020/a/b.css',
            type: 'text/css  ',
            value: Buffer.from('http://localhost:2020/ftftft/http://tested-page-3-in-frame.com'),
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

  function assertMapping(actualFrame, expectedFrame) {
    expect(actualFrame.blobs.map(b => b.value.toString())).to.eql(
      expectedFrame.blobs.map(b =>
        !b._shouldMap
          ? b.value.toString()
          : b.value.toString().replace(/http:\/\/localhost:2020\/ftftft\//g, ''),
      ),
    );

    const mappedUrl = (baseUrl, url) => {
      const fullProxyMapping = url.replace(/http:\/\/localhost:2020\/ftftft\//g, '');
      if (fullProxyMapping !== url) {
        return fullProxyMapping;
      }
      if (url.includes('http://localhost:2020/')) {
        return absolutizeUrl(url.replace('http://localhost:2020/', ''), baseUrl);
      } else {
        return url;
      }
    };

    expect(actualFrame.blobs.map(b => b.url)).to.eql(
      expectedFrame.blobs.map(b => (!b._shouldMap ? b.url : mappedUrl(expectedFrame.url, b.url))),
    );

    expect(actualFrame.cdt.map(n => n.nodeValue)).to.eql(
      expectedFrame.cdt.map(n =>
        !n._shouldMap ? n.nodeValue : n.nodeValue.replace(/http:\/\/localhost:2020\/ftftft\//g, ''),
      ),
    );
    expect(actualFrame.cdt.filter(n => n.attributes).map(n => n.attributes)).to.eql(
      expectedFrame.cdt
        .filter(n => n.attributes)
        .map(n => n.attributes)
        .map(attributes =>
          attributes.map(({name, value, _shouldMap}) =>
            !_shouldMap
              ? {name, value}
              : {name, value: value.replace(/http:\/\/localhost:2020\/ftftft\//g, '')},
          ),
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
      cdt.map(element => ({
        ...element,
        attributes:
          (element.attributes && element.attributes.map(({name, value}) => ({name, value}))) ||
          undefined,
        childNodeIndexes: element.childNodeIndexes && [...element.childNodeIndexes],
      }));
    return {
      blobs: cpyBlobs(frame.blobs),
      frames: [
        {
          cdt: cpyCdt(frame.frames[0].cdt),
          blobs: cpyBlobs(frame.frames[0].blobs),
          frames: [],
          url: frame.frames[0].url,
        },
      ],
      cdt: cpyCdt(frame.cdt),
      url: frame.url,
    };
  }
});
