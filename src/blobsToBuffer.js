'use strict';

function blobsToBuffer(frame) {
  frame.blobs.forEach(b => (b.value = Buffer.from(b.value, 'base64')));
  frame.frames.forEach(blobsToBuffer);
  return frame;
}

module.exports = blobsToBuffer;
