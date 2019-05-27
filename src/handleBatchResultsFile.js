'use strict';

const {TestResultsFormatter} = require('@applitools/eyes-sdk-core');
const {resolve} = require('path');
const {promisify} = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);

async function handleBatchResultsFile({results, tapDirPath}) {
  if (!tapDirPath) {
    return;
  }
  const formatter = new TestResultsFormatter(flat(results));
  const fileName = `eyes-${new Date().toISOString()}.tap`;
  const tapFile = resolve(tapDirPath, fileName);
  await writeFile(tapFile, formatter.asHierarchicTAPString(false, true));
}

function flat(arr) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}

module.exports = handleBatchResultsFile;
