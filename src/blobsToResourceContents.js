'use strict';

function blobsToResourceContents(frame) {
  frame.resourceContents = frame.blobs.reduce((acc, b) => ((acc[b.url] = b), acc), {});
  frame.frames = frame.frames.map(f => blobsToResourceContents(f));
  delete frame.blobs;
  return frame;
}

module.exports = blobsToResourceContents;
