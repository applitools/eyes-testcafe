/* global fixture, test */
const {ClientFunction} = require('testcafe');

const f = require('../dist/a');

const func = ClientFunction(f);

const url = process.argv[2];
if (url) {
  console.log('Debug running for', url);
} else {
  console.error('debug script missing url ');
  process.exit(1);
}

fixture`TestCafeDebug`.page(process.argv[2]);

test('Testcafe Eyes Render', async () => {
  console.log('@@@', await func());
  // await new Promise(r => setTimeout(r, 1000 * 60 * 60));
});
