'use strict';

function getResources(frame, predicate) {
  return uniq([
    ...frame.blobs.filter(predicate),
    ...frame.frames.reduce((acc, frame) => [...acc, ...getResources(frame, predicate)], []),
  ]);
}

function uniq(arr) {
  return Array.from(new Set(arr)).filter(x => !!x);
}

module.exports = getResources;
