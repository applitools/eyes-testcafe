/* global fixture, test */

const url = process.argv[2];
if (url) {
  console.log('Debug running for', url);
} else {
  console.error('debug script missing url ');
}

fixture`TestCafeDebug`.page(process.argv[2]);

test('Testcafe Eyes Render', async () => {
  await new Promise(r => setTimeout(r, 1000 * 60 * 60));
});
