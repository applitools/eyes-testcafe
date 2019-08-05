'use strict';

function collectFrameData({frame, keyName, predicate}) {
  return uniq([
    ...(predicate ? frame[keyName].filter(predicate) : frame[keyName]),
    ...frame.frames.reduce(
      (acc, frame) => [...acc, ...collectFrameData({frame, keyName, predicate})],
      [],
    ),
  ]);
}

function uniq(arr) {
  return Array.from(new Set(arr)).filter(x => !!x);
}

module.exports = collectFrameData;
