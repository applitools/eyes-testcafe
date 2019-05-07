/* global fixture, test */
import Eyes from '../src/eyes';
const eyes = new Eyes();

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

test('Testcafe Eyes Render', async () => {
  await eyes.open({appName: 'TestCafeRender', testName: 'Testcafe Eyes Render'});
  await eyes.checkWindow({tag: 'page loaded', debug: true});
});
