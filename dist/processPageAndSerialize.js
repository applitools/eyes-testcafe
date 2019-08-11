
module.exports = () => {
  var processPageAndSerialize = (function () {
  'use strict';

  // License: https://github.com/beatgammit/base64-js/blob/bf68aaa277d9de7007cc0c58279c411bb10670ac/LICENSE

  function arrayBufferToBase64(ab) {
    const lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    const uint8 = new Uint8Array(ab);
    const len = uint8.length;
    const extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

    const parts = [];
    const maxChunkLength = 16383; // must be multiple of 3

    let tmp; // go through the array every three bytes, we'll deal with trailing stuff later

    for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    } // pad the end with zeros, but make sure to not forget the extra bytes


    if (extraBytes === 1) {
      tmp = uint8[len - 1];
      parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3f] + '==');
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1];
      parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3f] + lookup[tmp << 2 & 0x3f] + '=');
    }

    return parts.join('');

    function tripletToBase64(num) {
      return lookup[num >> 18 & 0x3f] + lookup[num >> 12 & 0x3f] + lookup[num >> 6 & 0x3f] + lookup[num & 0x3f];
    }

    function encodeChunk(start, end) {
      let tmp;
      const output = [];

      for (let i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 0xff0000) + (uint8[i + 1] << 8 & 0xff00) + (uint8[i + 2] & 0xff);
        output.push(tripletToBase64(tmp));
      }

      return output.join('');
    }
  }

  var arrayBufferToBase64_1 = arrayBufferToBase64;

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (window.Array.isArray(arr)) {
      for (var i = 0, arr2 = new window.Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (window.Symbol.iterator in window.Object(iter) || window.Object.prototype.toString.call(iter) === "[object Arguments]") return window.Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function extractLinks(doc = document) {
    const srcsetUrls = window.Array.from(doc.querySelectorAll('img[srcset],source[srcset]')).map(srcsetEl => srcsetEl.getAttribute('srcset').split(',').map(str => str.trim().split(/\s+/)[0])).reduce((acc, urls) => acc.concat(urls), []);
    const srcUrls = window.Array.from(doc.querySelectorAll('img[src],source[src]')).map(srcEl => srcEl.getAttribute('src'));
    const imageUrls = window.Array.from(doc.querySelectorAll('image,use')).map(hrefEl => hrefEl.getAttribute('href') || hrefEl.getAttribute('xlink:href')).filter(u => u && u[0] !== '#');
    const objectUrls = window.Array.from(doc.querySelectorAll('object')).map(el => el.getAttribute('data')).filter(Boolean);
    const cssUrls = window.Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map(link => link.getAttribute('href'));
    const videoPosterUrls = window.Array.from(doc.querySelectorAll('video[poster]')).map(videoEl => videoEl.getAttribute('poster'));
    return window.Array.from(srcsetUrls).concat(window.Array.from(srcUrls)).concat(window.Array.from(imageUrls)).concat(window.Array.from(cssUrls)).concat(window.Array.from(videoPosterUrls)).concat(window.Array.from(objectUrls));
  }

  var extractLinks_1 = extractLinks;

  function absolutizeUrl(url, absoluteUrl) {
    return new URL(url, absoluteUrl).href;
  }

  var absolutizeUrl_1 = absolutizeUrl;

  function uuid() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0];
  }

  var uuid_1 = uuid;

  function isInlineFrame(frame) {
    return frame && frame.contentDocument && (!/^https?:$/.test(frame.contentDocument.location.protocol) || frame.src === 'about:blank');
  }

  var isInlineFrame_1 = isInlineFrame;

  function domNodesToCdt(docNode, url) {
    const cdt = [{
      nodeType: Node.DOCUMENT_NODE
    }];
    const docRoots = [docNode];
    const canvasElements = [];
    const inlineFrames = [];
    cdt[0].childNodeIndexes = childrenFactory(cdt, docNode.childNodes);
    return {
      cdt,
      docRoots,
      canvasElements,
      inlineFrames
    };

    function childrenFactory(cdt, elementNodes) {
      if (!elementNodes || elementNodes.length === 0) return null;
      const childIndexes = [];
      window.Array.prototype.forEach.call(elementNodes, elementNode => {
        const index = elementNodeFactory(cdt, elementNode);

        if (index !== null) {
          childIndexes.push(index);
        }
      });
      return childIndexes;
    }

    function elementNodeFactory(cdt, elementNode) {
      let node, manualChildNodeIndexes;
      const {
        nodeType
      } = elementNode;
      let dummyUrl, frameBase;

      if ([Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(nodeType)) {
        if (elementNode.nodeName !== 'SCRIPT') {
          if (elementNode.nodeName === 'STYLE' && elementNode.sheet && elementNode.sheet.cssRules.length) {
            cdt.push(getCssRulesNode(elementNode));
            manualChildNodeIndexes = [cdt.length - 1];
          }

          node = getBasicNode(elementNode);
          node.childNodeIndexes = manualChildNodeIndexes || (elementNode.childNodes.length ? childrenFactory(cdt, elementNode.childNodes) : []);

          if (elementNode.shadowRoot) {
            node.shadowRootIndex = elementNodeFactory(cdt, elementNode.shadowRoot);
            docRoots.push(elementNode.shadowRoot);
          }

          if (elementNode.nodeName === 'CANVAS') {
            dummyUrl = absolutizeUrl_1(`applitools-canvas-${uuid_1()}.png`, url);
            node.attributes.push({
              name: 'data-applitools-src',
              value: dummyUrl
            });
            canvasElements.push({
              element: elementNode,
              url: dummyUrl
            });
          }

          if (elementNode.nodeName === 'IFRAME' && isInlineFrame_1(elementNode)) {
            frameBase = getFrameBaseUrl(elementNode);
            dummyUrl = absolutizeUrl_1(`?applitools-iframe=${uuid_1()}`, frameBase || url);
            node.attributes.push({
              name: 'data-applitools-src',
              value: dummyUrl
            });
            inlineFrames.push({
              element: elementNode,
              url: dummyUrl
            });
          }
        } else {
          node = getScriptNode(elementNode);
        }
      } else if (nodeType === Node.TEXT_NODE) {
        node = getTextNode(elementNode);
      } else if (nodeType === Node.DOCUMENT_TYPE_NODE) {
        node = getDocNode(elementNode);
      }

      if (node) {
        cdt.push(node);
        return cdt.length - 1;
      } else {
        return null;
      }
    }

    function nodeAttributes({
      attributes = {}
    }) {
      return window.Object.keys(attributes).filter(k => attributes[k] && attributes[k].name);
    }

    function getCssRulesNode(elementNode) {
      return {
        nodeType: Node.TEXT_NODE,
        nodeValue: window.Array.from(elementNode.sheet.cssRules).map(rule => rule.cssText).join('')
      };
    }

    function getBasicNode(elementNode) {
      const node = {
        nodeType: elementNode.nodeType,
        nodeName: elementNode.nodeName,
        attributes: nodeAttributes(elementNode).map(key => {
          let value = elementNode.attributes[key].value;
          const name = elementNode.attributes[key].name;

          if (/^blob:/.test(value)) {
            value = value.replace(/^blob:/, '');
          }

          return {
            name,
            value
          };
        })
      };

      if (elementNode.tagName === 'INPUT' && ['checkbox', 'radio'].includes(elementNode.type)) {
        if (elementNode.attributes.checked && !elementNode.checked) {
          const idx = node.attributes.findIndex(a => a.name === 'checked');
          node.attributes.splice(idx, 1);
        }

        if (!elementNode.attributes.checked && elementNode.checked) {
          node.attributes.push({
            name: 'checked'
          });
        }
      }

      if (elementNode.tagName === 'INPUT' && elementNode.type === 'text' && (elementNode.attributes.value && elementNode.attributes.value.value) !== elementNode.value) {
        const nodeAttr = node.attributes.find(a => a.name === 'value');

        if (nodeAttr) {
          nodeAttr.value = elementNode.value;
        } else {
          node.attributes.push({
            name: 'value',
            value: elementNode.value
          });
        }
      }

      return node;
    }

    function getScriptNode(elementNode) {
      return {
        nodeType: Node.ELEMENT_NODE,
        nodeName: 'SCRIPT',
        attributes: nodeAttributes(elementNode).map(key => ({
          name: elementNode.attributes[key].name,
          value: elementNode.attributes[key].value
        })).filter(attr => attr.name !== 'src'),
        childNodeIndexes: []
      };
    }

    function getTextNode(elementNode) {
      return {
        nodeType: Node.TEXT_NODE,
        nodeValue: elementNode.nodeValue
      };
    }

    function getDocNode(elementNode) {
      return {
        nodeType: Node.DOCUMENT_TYPE_NODE,
        nodeName: elementNode.nodeName
      };
    }

    function getFrameBaseUrl(frameElement) {
      const href = frameElement.contentDocument.querySelectorAll('base') && frameElement.contentDocument.querySelectorAll('base')[0] && frameElement.contentDocument.querySelectorAll('base')[0].href;

      if (href && !href.includes('about:blank')) {
        return href;
      }
    }
  }

  var domNodesToCdt_1 = domNodesToCdt;

  function uniq(arr) {
    const result = [];
    new window.Set(arr).forEach(v => v && result.push(v));
    return result;
  }

  var uniq_1 = uniq;

  function aggregateResourceUrlsAndBlobs(resourceUrlsAndBlobsArr) {
    return resourceUrlsAndBlobsArr.reduce(({
      resourceUrls: allResourceUrls,
      blobsObj: allBlobsObj
    }, {
      resourceUrls,
      blobsObj
    }) => ({
      resourceUrls: uniq_1(allResourceUrls.concat(resourceUrls)),
      blobsObj: window.Object.assign(allBlobsObj, blobsObj)
    }), {
      resourceUrls: [],
      blobsObj: {}
    });
  }

  var aggregateResourceUrlsAndBlobs_1 = aggregateResourceUrlsAndBlobs;

  function makeGetResourceUrlsAndBlobs({
    processResource,
    aggregateResourceUrlsAndBlobs
  }) {
    return function getResourceUrlsAndBlobs(documents, baseUrl, urls) {
      return Promise.all(urls.map(url => processResource(url, documents, baseUrl, getResourceUrlsAndBlobs))).then(resourceUrlsAndBlobsArr => aggregateResourceUrlsAndBlobs(resourceUrlsAndBlobsArr));
    };
  }

  var getResourceUrlsAndBlobs = makeGetResourceUrlsAndBlobs;

  function filterInlineUrl(absoluteUrl) {
    return /^(blob|https?):/.test(absoluteUrl);
  }

  var filterInlineUrl_1 = filterInlineUrl;

  function toUnAnchoredUri(url) {
    const m = url && url.match(/(^[^#]*)/);
    const res = m && m[1] || url;
    return res && res.replace(/\?\s*$/, '') || url;
  }

  var toUnAnchoredUri_1 = toUnAnchoredUri;

  function createTempStylsheet(cssContent) {
    if (!cssContent) {
      console.log('[dom-snapshot] error createTempStylsheet called without cssContent');
      return;
    }

    const head = document.head || document.querySelectorAll('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('data-desc', 'Applitools tmp variable created by DOM SNAPSHOT');
    head.appendChild(style); // This is required for IE8 and below.

    if (style.styleSheet) {
      style.styleSheet.cssText = cssContent;
    } else {
      style.appendChild(document.createTextNode(cssContent));
    }

    return style.sheet;
  }

  var createTempStyleSheet = createTempStylsheet;

  function makeExtractResourcesFromStyle({
    extractResourcesFromStyleSheet
  }) {
    return function extractResourcesFromStyle(cssArrayBuffer, styleSheet, doc = document) {
      let corsFreeStyleSheet;
      let cssText;

      if (styleSheet) {
        try {
          styleSheet.cssRules;
          corsFreeStyleSheet = styleSheet;
        } catch (e) {
          console.log(`[dom-snapshot] could not access cssRules for ${styleSheet.href} ${e}\ncreating temp style for access.`);
          cssText = new TextDecoder('utf-8').decode(cssArrayBuffer);
          corsFreeStyleSheet = createTempStyleSheet(cssText);
        }
      } else {
        cssText = new TextDecoder('utf-8').decode(cssArrayBuffer);
        corsFreeStyleSheet = createTempStyleSheet(cssText);
      }

      const result = extractResourcesFromStyleSheet(corsFreeStyleSheet, doc);

      if (corsFreeStyleSheet !== styleSheet) {
        corsFreeStyleSheet.ownerNode.parentNode.removeChild(corsFreeStyleSheet.ownerNode);
      }

      return result;
    };
  }

  var extractResourcesFromStyle = makeExtractResourcesFromStyle;

  function makeProcessResource({
    fetchUrl,
    findStyleSheetByUrl,
    extractResourcesFromStyleSheet,
    extractResourcesFromSvg,
    cache = {}
  }) {
    let isFromSvgResource;
    const extractResourcesFromStyle$1 = extractResourcesFromStyle({
      extractResourcesFromStyleSheet
    });
    return function processResource(absoluteUrl, documents, baseUrl, getResourceUrlsAndBlobs) {
      return cache[absoluteUrl] || (cache[absoluteUrl] = doProcessResource(absoluteUrl));

      function doProcessResource(url) {
        return fetchUrl(url).catch(e => {
          if (probablyCORS(e)) {
            return {
              probablyCORS: true,
              url
            };
          } else {
            throw e;
          }
        }).then(({
          url,
          type,
          value,
          probablyCORS
        }) => {
          if (probablyCORS) {
            return {
              resourceUrls: [url]
            };
          }

          let result = {
            blobsObj: {
              [url]: {
                type,
                value
              }
            }
          };
          let resourceUrls;

          if (/text\/css/.test(type)) {
            let styleSheet = findStyleSheetByUrl(url, documents);

            if (styleSheet || isFromSvgResource) {
              resourceUrls = extractResourcesFromStyle$1(value, styleSheet, documents[0]);
            }
          } else if (/image\/svg/.test(type)) {
            try {
              resourceUrls = extractResourcesFromSvg(value);

              if (resourceUrls && !isFromSvgResource) {
                isFromSvgResource = url;
              }
            } catch (e) {
              console.log('could not parse svg content', e);
            }
          }

          if (resourceUrls) {
            result = mapUrlsAndGetResult({
              resourceUrls,
              url,
              type,
              value
            }).then(res => (res));
          }

          return result;
        }).catch(err => {
          console.log('[dom-snapshot] error while fetching', url, err);
          return {};
        });
      }

      function mapUrlsAndGetResult({
        resourceUrls,
        url,
        type,
        value
      }) {
        const urls = resourceUrls.map(resourceUrl => absolutizeUrl_1(resourceUrl, url.replace(/^blob:/, ''))).map(toUnAnchoredUri_1).filter(filterInlineUrl_1);
        return getResourceUrlsAndBlobs(documents, baseUrl, urls).then(({
          resourceUrls,
          blobsObj
        }) => ({
          resourceUrls,
          blobsObj: window.Object.assign(blobsObj, {
            [url]: {
              type,
              value
            }
          })
        }));
      }

      function probablyCORS(err) {
        const msg = err.message && (err.message.includes('Failed to fetch') || err.message.includes('Network request failed'));
        const name = err.name && err.name.includes('TypeError');
        return msg && name;
      }
    };
  }

  var processResource = makeProcessResource;

  function getUrlFromCssText(cssText) {
    const re = /url\((?!['"]?:)['"]?([^'")]*)['"]?\)/g;
    const ret = [];
    let result;

    while ((result = re.exec(cssText)) !== null) {
      ret.push(result[1]);
    }

    return ret;
  }

  var getUrlFromCssText_1 = getUrlFromCssText;

  function flat(arr) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(arr));
  }

  var flat_1 = flat;

  function makeExtractResourcesFromSvg({
    parser,
    decoder,
    extractResourceUrlsFromStyleTags
  }) {
    return function (svgArrayBuffer) {
      const decooder = decoder || new TextDecoder('utf-8');
      const svgStr = decooder.decode(svgArrayBuffer);
      const domparser = parser || new DOMParser();
      const doc = domparser.parseFromString(svgStr, 'image/svg+xml');
      const fromHref = window.Array.from(doc.querySelectorAll('image,use,link[rel="stylesheet"]')).map(e => e.getAttribute('href') || e.getAttribute('xlink:href'));
      const fromObjects = window.Array.from(doc.getElementsByTagName('object')).map(e => e.getAttribute('data'));
      const fromStyleTags = extractResourceUrlsFromStyleTags(doc, false);
      const fromStyleAttrs = urlsFromStyleAttrOfDoc(doc);
      return fromHref.concat(fromObjects).concat(fromStyleTags).concat(fromStyleAttrs).filter(u => u[0] !== '#');
    };
  }

  function urlsFromStyleAttrOfDoc(doc) {
    return flat_1(window.Array.from(doc.querySelectorAll('*[style]')).map(e => e.style.cssText).map(getUrlFromCssText_1).filter(Boolean));
  }

  var makeExtractResourcesFromSvg_1 = makeExtractResourcesFromSvg;

  /* global window */

  function fetchUrl(url, fetch = window.fetch) {
    return fetch(url, {
      cache: 'force-cache',
      credentials: 'same-origin'
    }).then(resp => resp.status === 200 ? resp.arrayBuffer().then(buff => ({
      url,
      type: resp.headers.get('Content-Type'),
      value: buff
    })) : Promise.reject(`bad status code ${resp.status}`));
  }

  var fetchUrl_1 = fetchUrl;

  function makeFindStyleSheetByUrl({
    styleSheetCache
  }) {
    return function findStyleSheetByUrl(url, documents) {
      const allStylesheets = flat_1(documents.map(d => window.Array.from(d.styleSheets)));
      return styleSheetCache[url] || allStylesheets.find(styleSheet => styleSheet.href && toUnAnchoredUri_1(styleSheet.href) === url);
    };
  }

  var findStyleSheetByUrl = makeFindStyleSheetByUrl;

  function makeExtractResourcesFromStyleSheet({
    styleSheetCache
  }) {
    return function extractResourcesFromStyleSheet(styleSheet, doc) {
      const win = doc.defaultView || doc.ownerDocument && doc.ownerDocument.defaultView || window;
      const urls = uniq_1(window.Array.from(styleSheet.cssRules || []).reduce((acc, rule) => {
        if (rule instanceof win.CSSImportRule) {
          styleSheetCache[rule.styleSheet.href] = rule.styleSheet;
          return acc.concat(rule.href);
        } else if (rule instanceof win.CSSFontFaceRule) {
          return acc.concat(getUrlFromCssText_1(rule.cssText));
        } else if (win.CSSSupportsRule && rule instanceof win.CSSSupportsRule || rule instanceof win.CSSMediaRule) {
          return acc.concat(extractResourcesFromStyleSheet(rule, doc));
        } else if (rule instanceof win.CSSStyleRule) {
          for (let i = 0, ii = rule.style.length; i < ii; i++) {
            const urls = getUrlFromCssText_1(rule.style.getPropertyValue(rule.style[i]));
            urls.length && (acc = acc.concat(urls));
          }
        }

        return acc;
      }, []));
      return urls.filter(u => u[0] !== '#');
    };
  }

  var extractResourcesFromStyleSheet = makeExtractResourcesFromStyleSheet;

  function extractResourceUrlsFromStyleAttrs(cdt) {
    return cdt.reduce((acc, node) => {
      if (node.nodeType === 1) {
        const styleAttr = node.attributes && node.attributes.find(attr => attr.name.toUpperCase() === 'STYLE');
        if (styleAttr) acc = acc.concat(getUrlFromCssText_1(styleAttr.value));
      }

      return acc;
    }, []);
  }

  var extractResourceUrlsFromStyleAttrs_1 = extractResourceUrlsFromStyleAttrs;

  function makeExtractResourceUrlsFromStyleTags(extractResourcesFromStyleSheet) {
    return function extractResourceUrlsFromStyleTags(doc, onlyDocStylesheet = true) {
      return uniq_1(window.Array.from(doc.querySelectorAll('style')).reduce((resourceUrls, styleEl) => {
        const styleSheet = onlyDocStylesheet ? window.Array.from(doc.styleSheets).find(styleSheet => styleSheet.ownerNode === styleEl) : styleEl.sheet;
        return styleSheet ? resourceUrls.concat(extractResourcesFromStyleSheet(styleSheet, doc)) : resourceUrls;
      }, []));
    };
  }

  var extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags;

  function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
  }

  var base64ToArrayBuffer_1 = base64ToArrayBuffer;

  function buildCanvasBlobs(canvasElements) {
    return canvasElements.map(({
      url,
      element
    }) => {
      const data = element.toDataURL('image/png');
      const value = base64ToArrayBuffer_1(data.split(',')[1]);
      return {
        url,
        type: 'image/png',
        value
      };
    });
  }

  var buildCanvasBlobs_1 = buildCanvasBlobs;

  function extractFrames(documents = [document]) {
    const iframes = flat_1(documents.map(d => window.Array.from(d.querySelectorAll('iframe[src]:not([src=""])'))));
    return iframes.filter(f => isAccessibleFrame(f) && !isInlineFrame_1(f)).map(f => f.contentDocument);
  }

  function isAccessibleFrame(frame) {
    try {
      const doc = frame.contentDocument;
      return !!(doc && doc.defaultView && doc.defaultView.frameElement);
    } catch (err) {// for CORS frames
    }
  }

  var extractFrames_1 = extractFrames;

  const getBaesUrl = function (doc) {
    const baseUrl = doc.querySelectorAll('base')[0] && doc.querySelectorAll('base')[0].href;

    if (baseUrl) {
      return baseUrl;
    }

    const frameElement = doc.defaultView && doc.defaultView.frameElement;

    if (frameElement) {
      return frameElement.src || getBaesUrl(frameElement.ownerDocument);
    }

    return doc.location.href;
  };

  var getBaseUrl = getBaesUrl;

  function toUriEncoding(url) {
    const result = url && url.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, s => {
      const int = parseInt(s.substr(1).trim(), 16);
      return String.fromCodePoint(int);
    }) || url;
    return result;
  }

  var toUriEncoding_1 = toUriEncoding;

  function processPage(doc = document) {
    const styleSheetCache = {};
    const extractResourcesFromStyleSheet$1 = extractResourcesFromStyleSheet({
      styleSheetCache
    });
    const findStyleSheetByUrl$1 = findStyleSheetByUrl({
      styleSheetCache
    });
    const extractResourceUrlsFromStyleTags$1 = extractResourceUrlsFromStyleTags(extractResourcesFromStyleSheet$1);
    const extractResourcesFromSvg = makeExtractResourcesFromSvg_1({
      extractResourceUrlsFromStyleTags: extractResourceUrlsFromStyleTags$1
    });
    const processResource$1 = processResource({
      fetchUrl: fetchUrl_1,
      findStyleSheetByUrl: findStyleSheetByUrl$1,
      extractResourcesFromStyleSheet: extractResourcesFromStyleSheet$1,
      extractResourcesFromSvg,
      absolutizeUrl: absolutizeUrl_1
    });
    const getResourceUrlsAndBlobs$1 = getResourceUrlsAndBlobs({
      processResource: processResource$1,
      aggregateResourceUrlsAndBlobs: aggregateResourceUrlsAndBlobs_1
    });
    return doProcessPage(doc);

    function doProcessPage(doc, baesUrl = null) {
      const url = baesUrl || getBaseUrl(doc);
      const {
        cdt,
        docRoots,
        canvasElements,
        inlineFrames
      } = domNodesToCdt_1(doc, url);
      const linkUrls = flat_1(docRoots.map(extractLinks_1));
      const styleTagUrls = flat_1(docRoots.map(extractResourceUrlsFromStyleTags$1));
      const absolutizeThisUrl = getAbsolutizeByUrl(url);
      const links = uniq_1(window.Array.from(linkUrls).concat(window.Array.from(styleTagUrls)).concat(extractResourceUrlsFromStyleAttrs_1(cdt))).map(toUriEncoding_1).map(absolutizeThisUrl).map(toUnAnchoredUri_1).filter(filterInlineUrlsIfExisting);
      const resourceUrlsAndBlobsPromise = getResourceUrlsAndBlobs$1(docRoots, url, links);
      const canvasBlobs = buildCanvasBlobs_1(canvasElements);
      const frameDocs = extractFrames_1(docRoots);
      const processFramesPromise = frameDocs.map(f => doProcessPage(f, null));
      const processInlineFramesPromise = inlineFrames.map(({
        element,
        url
      }) => doProcessPage(element.contentDocument, url));
      const frameElement = doc.defaultView && doc.defaultView.frameElement;
      return Promise.all([resourceUrlsAndBlobsPromise].concat(_toConsumableArray(processFramesPromise), _toConsumableArray(processInlineFramesPromise))).then(([{
        resourceUrls,
        blobsObj
      }, ...framesResults]) => ({
        cdt,
        url,
        resourceUrls,
        blobs: [].concat(_toConsumableArray(blobsObjToArray(blobsObj)), _toConsumableArray(canvasBlobs)),
        frames: framesResults,
        srcAttr: frameElement ? frameElement.getAttribute('src') : undefined
      }));
    }
  }

  function getAbsolutizeByUrl(url) {
    return function (someUrl) {
      try {
        return absolutizeUrl_1(someUrl, url);
      } catch (err) {// can't do anything with a non-absolute url
      }
    };
  }

  function blobsObjToArray(blobsObj) {
    return window.Object.keys(blobsObj).map(blobUrl => window.Object.assign({
      url: blobUrl.replace(/^blob:/, '')
    }, blobsObj[blobUrl]));
  }

  function filterInlineUrlsIfExisting(absoluteUrl) {
    return absoluteUrl && filterInlineUrl_1(absoluteUrl);
  }

  var processPage_1 = processPage;

  function processPageAndSerialize(doc) {
    return processPage_1(doc).then(serializeFrame);
  }

  function serializeFrame(frame) {
    frame.blobs = frame.blobs.map(({
      url,
      type,
      value
    }) => ({
      url,
      type,
      value: arrayBufferToBase64_1(value)
    }));
    frame.frames.forEach(serializeFrame);
    return frame;
  }

  var processPageAndSerialize_1 = processPageAndSerialize;

  return processPageAndSerialize_1;

}());
  return processPageAndSerialize()
}