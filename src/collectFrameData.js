'use strict';

function collectFrameData({frame, predicate, keyName}) {
  return uniq([
    ...frame[keyName].filter(predicate),
    ...frame.frames.reduce(
      (acc, frame) => [...acc, ...collectFrameData({frame, predicate, keyName})],
      [],
    ),
  ]);
}

function uniq(arr) {
  return Array.from(new Set(arr)).filter(x => !!x);
}

module.exports = collectFrameData;
