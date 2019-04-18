'use strict';
import { ClientFunction } from 'testcafe';
const processPage = require('@applitools/dom-snapshot/src/browser/processPage');
const getAllBlobs = require('./getAllBlobs');

function eyesCheckWindow(doc = document, args) {
    let tag,
        sizeMode,
        selector,
        region,
        scriptHooks,
        ignore,
        floating,
        layout,
        strict,
        sendDom,
        saveCdt,
        useDom,
        enablePatterns;
    if (typeof args === 'string') {
        tag = args;
    } else if (typeof args === 'object') {
        tag = args.tag;
        sizeMode = args.sizeMode;
        selector = args.selector;
        region = args.region;
        scriptHooks = args.scriptHooks;
        ignore = args.ignore;
        floating = args.floating;
        layout = args.layout;
        strict = args.strict;
        sendDom = args.sendDom;
        useDom = args.useDom;
        enablePatterns = args.enablePatterns;
        saveCdt = args.saveCdt || undefined;
    }

    return __processPage(doc).then(mainFrame => {
        const allBlobs = __getAllBlobs(mainFrame).map(mapBlob);
        const {resourceUrls, blobData, frames, url, cdt} = replaceBlobsWithBlobDataInFrame(mainFrame);
        const data = {
                url,
                resourceUrls,
                cdt,
                tag,
                sizeMode,
                blobData,
                selector,
                region,
                scriptHooks,
                ignore,
                floating,
                layout,
                strict,
                frames,
                sendDom,
                saveCdt,
                useDom,
                enablePatterns,
                blobs: allBlobs // blob values are empty on stringify.. need to serialize..
        };
        return JSON.stringify(data);
    });

    // function arrayBufferToBase64(ab) {
    //     const lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    //
    //     const uint8 = new Uint8Array(ab);
    //     const len = uint8.length;
    //     const extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
    //     const parts = [];
    //     const maxChunkLength = 16383; // must be multiple of 3
    //
    //     let tmp;
    //
    //     // go through the array every three bytes, we'll deal with trailing stuff later
    //     for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    //         parts.push(encodeChunk(i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    //     }
    //
    //     // pad the end with zeros, but make sure to not forget the extra bytes
    //     if (extraBytes === 1) {
    //         tmp = uint8[len - 1];
    //         parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f] + '==');
    //     } else if (extraBytes === 2) {
    //         tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    //         parts.push(lookup[tmp >> 10] + lookup[(tmp >> 4) & 0x3f] + lookup[(tmp << 2) & 0x3f] + '=');
    //     }
    //
    //     return parts.join('');
    //
    //     function tripletToBase64(num) {
    //         return (
    //             lookup[(num >> 18) & 0x3f] +
    //             lookup[(num >> 12) & 0x3f] +
    //             lookup[(num >> 6) & 0x3f] +
    //             lookup[num & 0x3f]
    //         );
    //     }
    //
    //     function encodeChunk(start, end) {
    //         let tmp;
    //         const output = [];
    //         for (let i = start; i < end; i += 3) {
    //             tmp = ((uint8[i] << 16) & 0xff0000) + ((uint8[i + 1] << 8) & 0xff00) + (uint8[i + 2] & 0xff);
    //             output.push(tripletToBase64(tmp));
    //         }
    //         return output.join('');
    //     }
    // }
    //
    // function processPageAndSerialize(doc) {
    //     return __processPage(doc).then(serializeFrame);
    // }
    //
    // function serializeFrame(frame) {
    //     frame.blobs = frame.blobs.map(({url, type, value}) => ({
    //         url,
    //         type,
    //         value: arrayBufferToBase64(value),
    //     }));
    //     frame.frames.forEach(serializeFrame);
    //     return frame;
    // }

    function uniq(arr) {
        let array = [];
        arr.forEach(v => {
            if(array.indexOf(v) === -1) {
                array.push(v)
            }
        });
        return array.filter(x => !!x);
    }

    function __getAllBlobs(frame) {
        return uniq([
            ...frame.blobs,
            ...frame.frames.reduce((acc, frame) => [...acc, ...getAllBlobs(frame)], []),
        ]);
    }

    function assign(a, b){
        const n = {}
        Object.keys(a).forEach(k => {
            n[k] = a[k];
        })
        Object.keys(b).forEach(k => {
            n[k] = b[k];
        })
        return n;
    }

    function replaceBlobsWithBlobDataInFrame({url, cdt, resourceUrls, blobs, frames}) {
        return {
            url,
            cdt,
            resourceUrls,
            blobData: blobs.map(mapBlobData),
            frames: frames.map(replaceBlobsWithBlobDataInFrame),
        };
    }

    function mapBlobData({url, type}) {
        return {url, type: type || 'application/x-applitools-unknown'};
    }

    function mapBlob({url, type, value}) {
        return {url, type: type || 'application/x-applitools-unknown', value};
    }

    function __processPage() {
        var processPage = (function () {
            'use strict';

            function extractLinks(doc = document) {
                const srcsetUrls = Array.prototype.slice.call(doc.querySelectorAll('img[srcset],source[srcset]'))
                    .map(srcsetEl =>
                        srcsetEl
                            .getAttribute('srcset')
                            .split(',')
                            .map(str => str.trim().split(/\s+/)[0]),
                    )
                    .reduce((acc, urls) => acc.concat(urls), []);

                const srcUrls = Array.prototype.slice.call(doc.querySelectorAll('img[src],source[src]')).map(srcEl =>
                    srcEl.getAttribute('src'),
                );

                const cssUrls = Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"]')).map(link =>
                    link.getAttribute('href'),
                );

                const videoPosterUrls = Array.prototype.slice.call(doc.querySelectorAll('video[poster]')).map(videoEl =>
                    videoEl.getAttribute('poster'),
                );

                return srcsetUrls.concat(srcUrls).concat(cssUrls).concat(videoPosterUrls);
            }

            var extractLinks_1 = extractLinks;

            /* eslint-disable no-use-before-define */

            function domNodesToCdt(docNode) {
                const NODE_TYPES = {
                    ELEMENT: 1,
                    TEXT: 3,
                    DOCUMENT: 9,
                    DOCUMENT_TYPE: 10,
                };

                const domNodes = [
                    {
                        nodeType: NODE_TYPES.DOCUMENT,
                    },
                ];
                domNodes[0].childNodeIndexes = childrenFactory(domNodes, docNode.childNodes);
                return domNodes;

                function childrenFactory(domNodes, elementNodes) {
                    if (!elementNodes || elementNodes.length === 0) return null;

                    const childIndexes = [];
                    elementNodes.forEach(elementNode => {
                        const index = elementNodeFactory(domNodes, elementNode);
                        if (index !== null) {
                            childIndexes.push(index);
                        }
                    });

                    return childIndexes;
                }

                function elementNodeFactory(domNodes, elementNode) {
                    let node;
                    const {nodeType} = elementNode;
                    if (nodeType === NODE_TYPES.ELEMENT) {
                        if (elementNode.nodeName !== 'SCRIPT') {
                            if (
                                elementNode.nodeName === 'STYLE' &&
                                !elementNode.textContent &&
                                elementNode.sheet &&
                                elementNode.sheet.cssRules.length
                            ) {
                                elementNode.appendChild(
                                    docNode.createTextNode(
                                        Array.prototype.slice.call(elementNode.sheet.cssRules).map(rule => rule.cssText).join(''),
                                    ),
                                );
                            }

                            node = {
                                nodeType: NODE_TYPES.ELEMENT,
                                nodeName: elementNode.nodeName,
                                attributes: Object.keys(elementNode.attributes).map(key => {
                                    let value = elementNode.attributes[key].value;
                                    const name = elementNode.attributes[key].localName;

                                    if (/^blob:/.test(value)) {
                                        value = value.replace(/^blob:/, '');
                                    }

                                    return {
                                        name,
                                        value,
                                    };
                                }),
                                childNodeIndexes: elementNode.childNodes.length
                                    ? childrenFactory(domNodes, elementNode.childNodes)
                                    : [],
                            };

                            if (elementNode.checked && !elementNode.attributes.checked) {
                                node.attributes.push({name: 'checked', value: 'checked'});
                            }
                            if (
                                elementNode.value !== undefined &&
                                elementNode.attributes.value === undefined &&
                                elementNode.tagName === 'INPUT' &&
                                elementNode.type === 'text'
                            ) {
                                node.attributes.push({name: 'value', value: elementNode.value});
                            }
                        }
                    } else if (nodeType === NODE_TYPES.TEXT) {
                        node = {
                            nodeType: NODE_TYPES.TEXT,
                            nodeValue: elementNode.nodeValue,
                        };
                    } else if (nodeType === NODE_TYPES.DOCUMENT_TYPE) {
                        node = {
                            nodeType: NODE_TYPES.DOCUMENT_TYPE,
                            nodeName: elementNode.nodeName,
                        };
                    }

                    if (node) {
                        domNodes.push(node);
                        return domNodes.length - 1;
                    } else {
                        // console.log(`Unknown nodeType: ${nodeType}`);
                        return null;
                    }
                }
            }

            var domNodesToCdt_1 = domNodesToCdt;
            var NODE_TYPES = {
                ELEMENT: 1,
                TEXT: 3,
                DOCUMENT: 9,
                DOCUMENT_TYPE: 10,
            };
            domNodesToCdt_1.NODE_TYPES = NODE_TYPES;

            function extractFrames(doc = document) {
                return Array.prototype.slice.call(doc.querySelectorAll('iframe[src]:not([src=""])'))
                    .map(srcEl => {
                        try {
                            const contentDoc = srcEl.contentDocument;
                            return (
                                contentDoc &&
                                /^https?:$/.test(contentDoc.location.protocol) &&
                                contentDoc.defaultView &&
                                contentDoc.defaultView.frameElement &&
                                contentDoc
                            );
                        } catch (err) {
                            //for CORS frames
                        }
                    })
                    .filter(x => !!x);
            }

            var extractFrames_1 = extractFrames;

            var uniq_1 = uniq;

            function aggregateResourceUrlsAndBlobs(resourceUrlsAndBlobsArr) {
                return resourceUrlsAndBlobsArr.reduce(
                    ({resourceUrls: allResourceUrls, blobsObj: allBlobsObj}, {resourceUrls, blobsObj}) => ({
                        resourceUrls: uniq_1(allResourceUrls.concat(resourceUrls)),
                        blobsObj: assign(allBlobsObj, blobsObj),
                    }),
                    {resourceUrls: [], blobsObj: {}},
                );
            }

            var aggregateResourceUrlsAndBlobs_1 = aggregateResourceUrlsAndBlobs;

            function makeGetResourceUrlsAndBlobs({processResource, aggregateResourceUrlsAndBlobs}) {
                return function getResourceUrlsAndBlobs(doc, baseUrl, urls) {
                    return Promise.all(
                        urls.map(url => processResource(url, doc, baseUrl, getResourceUrlsAndBlobs.bind(null, doc))),
                    ).then(resourceUrlsAndBlobsArr => aggregateResourceUrlsAndBlobs(resourceUrlsAndBlobsArr));
                };
            }

            var getResourceUrlsAndBlobs = makeGetResourceUrlsAndBlobs;

            function filterInlineUrl(absoluteUrl) {
                return /^(blob|https?):/.test(absoluteUrl);
            }

            var filterInlineUrl_1 = filterInlineUrl;

            function absolutizeUrl(url, absoluteUrl) {
                return new URL(url, absoluteUrl).href;
            }

            var absolutizeUrl_1 = absolutizeUrl;

            function makeProcessResource({
                                             fetchUrl,
                                             findStyleSheetByUrl,
                                             extractResourcesFromStyleSheet,
                                             isSameOrigin,
                                             cache = {},
                                         }) {
                return function processResource(absoluteUrl, doc, baseUrl, getResourceUrlsAndBlobs) {
                    return cache[absoluteUrl] || (cache[absoluteUrl] = doProcessResource(absoluteUrl));

                    function doProcessResource(url) {
                        return fetchUrl(url)
                            .catch(e => {
                                if (probablyCORS(e, url)) {
                                    return {probablyCORS: true, url};
                                } else {
                                    throw e;
                                }
                            })
                            .then(({url, type, value, probablyCORS}) => {
                                if (probablyCORS) {
                                    return {resourceUrls: [url]};
                                }
                                const result = {blobsObj: {[url]: {type, value}}};
                                if (/text\/css/.test(type)) {
                                    const styleSheet = findStyleSheetByUrl(url, doc);
                                    if (!styleSheet) {
                                        return result;
                                    }
                                    const resourceUrls = extractResourcesFromStyleSheet(styleSheet, doc.defaultView)
                                        .map(resourceUrl => absolutizeUrl_1(resourceUrl, url.replace(/^blob:/, '')))
                                        .filter(filterInlineUrl_1);
                                    return getResourceUrlsAndBlobs(baseUrl, resourceUrls).then(
                                        ({resourceUrls, blobsObj}) => ({
                                            resourceUrls,
                                            blobsObj: assign(blobsObj, {[url]: {type, value}}),
                                        }),
                                    );
                                } else {
                                    return result;
                                }
                            })
                            .catch(err => {
                                console.log('[dom-snapshot] error while fetching', url, err);
                                return {};
                            });
                    }

                    function probablyCORS(err, url) {
                        const msgCORS = err.message && err.message.includes('Failed to fetch');
                        const nameCORS = err.name && err.name.includes('TypeError');
                        return msgCORS && nameCORS && !isSameOrigin(url, baseUrl);
                    }
                };
            }

            var processResource = makeProcessResource;

            /* global window */

            function fetchUrl(url, fetch = window.fetch) {
                return fetch(url, {cache: 'force-cache', credentials: 'same-origin'}).then(resp =>
                    resp.arrayBuffer().then(buff => ({
                        url,
                        type: resp.headers.get('Content-Type'),
                        value: buff,
                    })),
                );
            }

            var fetchUrl_1 = fetchUrl;

            function makeFindStyleSheetByUrl({styleSheetCache}) {
                return function findStyleSheetByUrl(url, doc) {
                    return styleSheetCache[url] || Array.prototype.slice.call(doc.styleSheets).find(styleSheet => styleSheet.href === url);
                };
            }

            var findStyleSheetByUrl = makeFindStyleSheetByUrl;

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

            // NOTE this code is very similar to the node part of visual-grid-client, but there is a different related to the browser's cssom with import rules
            function makeExtractResourcesFromStyleSheet({styleSheetCache}) {
                return function extractResourcesFromStyleSheet(styleSheet, win = window) {
                    return uniq_1(
                        Array.prototype.slice.call((styleSheet.cssRules || [])).reduce((acc, rule) => {
                            if (rule instanceof win.CSSImportRule) {
                                styleSheetCache[rule.styleSheet.href] = rule.styleSheet;
                                return acc.concat(rule.href);
                            } else if (rule instanceof win.CSSFontFaceRule) {
                                return acc.concat(getUrlFromCssText_1(rule.style.getPropertyValue('src')));
                            } else if (rule instanceof win.CSSSupportsRule || rule instanceof win.CSSMediaRule) {
                                return acc.concat(extractResourcesFromStyleSheet(rule));
                            } else if (rule instanceof win.CSSStyleRule) {
                                for (let i = 0, ii = rule.style.length; i < ii; i++) {
                                    const urls = getUrlFromCssText_1(rule.style.getPropertyValue(rule.style[i]));
                                    urls.length && (acc = acc.concat(urls));
                                }
                            }
                            return acc;
                        }, []),
                    );
                };
            }

            var extractResourcesFromStyleSheet = makeExtractResourcesFromStyleSheet;

            function extractResourceUrlsFromStyleAttrs(cdt) {
                return cdt.reduce((acc, node) => {
                    if (node.nodeType === 1) {
                        const styleAttr =
                            node.attributes && node.attributes.find(attr => attr.name && (attr.name.toUpperCase() === 'STYLE'));

                        if (styleAttr) acc = acc.concat(getUrlFromCssText_1(styleAttr.value));
                    }
                    return acc;
                }, []);
            }

            var extractResourceUrlsFromStyleAttrs_1 = extractResourceUrlsFromStyleAttrs;

            function makeExtractResourceUrlsFromStyleTags(extractResourcesFromStyleSheet) {
                return function extractResourceUrlsFromStyleTags(doc) {
                    return uniq_1(
                        Array.prototype.slice.call(doc.getElementsByTagName('style')).reduce((resourceUrls, styleEl) => {
                            const styleSheet = Array.prototype.slice.call(doc.styleSheets).find(
                                styleSheet => styleSheet.ownerNode === styleEl,
                            );
                            return resourceUrls.concat(extractResourcesFromStyleSheet(styleSheet, doc.defaultView));
                        }, []),
                    );
                };
            }

            var extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags;

            function isSameOrigin(url, baseUrl) {
                const blobOrData = /^(blob|data):/;
                if (blobOrData.test(url)) return true;
                if (blobOrData.test(baseUrl)) return false;

                const {origin} = new URL(url, baseUrl);
                const {origin: baseOrigin} = new URL(baseUrl);
                return origin === baseOrigin;
            }

            var isSameOrigin_1 = isSameOrigin;

            function processPage(doc = document) {
                const styleSheetCache = {};
                const extractResourcesFromStyleSheet$$1 = extractResourcesFromStyleSheet({styleSheetCache});
                const findStyleSheetByUrl$$1 = findStyleSheetByUrl({styleSheetCache});
                const processResource$$1 = processResource({
                    fetchUrl: fetchUrl_1,
                    findStyleSheetByUrl: findStyleSheetByUrl$$1,
                    extractResourcesFromStyleSheet: extractResourcesFromStyleSheet$$1,
                    absolutizeUrl: absolutizeUrl_1,
                    isSameOrigin: isSameOrigin_1,
                });

                const getResourceUrlsAndBlobs$$1 = getResourceUrlsAndBlobs({
                    processResource: processResource$$1,
                    aggregateResourceUrlsAndBlobs: aggregateResourceUrlsAndBlobs_1,
                });

                const extractResourceUrlsFromStyleTags$$1 = extractResourceUrlsFromStyleTags(
                    extractResourcesFromStyleSheet$$1,
                );

                return doProcessPage(doc);

                function doProcessPage(doc) {
                    const frameElement = doc.defaultView && doc.defaultView.frameElement;
                    const url = frameElement ? frameElement.src : doc.location.href;

                    const cdt = domNodesToCdt_1(doc);

                    const links = uniq_1(
                        extractLinks_1(doc)
                            .concat(extractResourceUrlsFromStyleAttrs_1(cdt))
                            .concat(extractResourceUrlsFromStyleTags$$1(doc)),
                    )
                        .map(absolutizeThisUrl)
                        .filter(filterInlineUrlsIfExisting);

                    const resourceUrlsAndBlobsPromise = getResourceUrlsAndBlobs$$1(doc, url, links);

                    const frameDocs = extractFrames_1(doc);
                    const processFramesPromise = frameDocs.map(doProcessPage);

                    return Promise.all([resourceUrlsAndBlobsPromise].concat(processFramesPromise)).then(
                        (arg) => {
                            const resourceUrls = arg[0].resourceUrls;
                            const blobsObj = arg[0].blobsObj;
                            const framesResults = arg.splice(1);
                            return {
                                cdt,
                                    url,
                                    resourceUrls,
                                    blobs
                            :
                                blobsObjToArray(blobsObj),
                                    frames
                            :
                                framesResults,
                                    srcAttr
                            :
                                frameElement ? frameElement.getAttribute('src') : undefined,
                            }
                        },
                    );

                    function absolutizeThisUrl(someUrl) {
                        try {
                            return absolutizeUrl_1(someUrl, url);
                        } catch (err) {
                            // can't do anything with a non-absolute url
                        }
                    }
                }
            }

            function blobsObjToArray(blobsObj) {
                return Object.keys(blobsObj).map(blobUrl =>
                    assign(
                        {
                            url: blobUrl.replace(/^blob:/, ''),
                        },
                        blobsObj[blobUrl],
                    ),
                );
            }

            function filterInlineUrlsIfExisting(absoluteUrl) {
                return absoluteUrl && filterInlineUrl_1(absoluteUrl);
            }

            var processPage_1 = processPage;

            return processPage_1;

        }());

        return processPage.apply(this, arguments);
    }
};

const getResources = ClientFunction(() => {
    return eyesCheckWindow();
}, {dependencies: {processPage, getAllBlobs, eyesCheckWindow}});

module.exports = getResources;
