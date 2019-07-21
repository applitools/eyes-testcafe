/* global fixture, test */
import Eyes from '../src/eyes';
import path from 'path';
const configPath = path.resolve(__dirname, '../tests/fixtures/applitools.config.js');
const eyes = new Eyes({configPath});

const url = process.argv[2];
if (url) {
  console.log('Render running for', url);
} else {
  console.error('render script missing url ');
}

fixture`TestCafeRender`
  .page(process.argv[2])
  .afterEach(async () => eyes.close())
  .after(async () => {
    const [results] = await eyes.waitForResults(true);
    if (results.some(r => r instanceof Error)) {
      console.log(
        '\nTest error:\n\t',
        results.map(r => r.message || r).reduce((acc, m) => ((acc = `${acc}\n\t${m}`), acc), ''),
      );
    } else {
      console.log(
        '\nTest result:\n\t',
        results.map(r => `${r.getStatus()} ${r.getUrl()}`).join('\n\t'),
      );
    }
  });

test('Testcafe Eyes Render', async t => {
  await new Promise(r => setTimeout(r, 1000));
  await eyes.open({appName: 'TestCafeRender', testName: `Testcafe Render ${url}`, t});
  await eyes.checkWindow({tag: 'page loaded'});
});
