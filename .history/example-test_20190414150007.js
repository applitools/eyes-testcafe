import {Selector} from "testcafe";
import Eyes from 'eyes-testcafe';

fixture `Getting Started`
    .page `https://applitools.com/helloworld`
    .after(Eyes.after)
    .before(() =>
        Eyes.eyesOpen({
            appName: 'TestCafeApp',
            testName: 'testing Cafe',
            browser: [
                {width: 800, height: 600, name: 'firefox'},
                {width: 1024, height: 768, name: 'chrome'}
            ]
        })
    );

test('My App Test', async t => {
    const checkbox = Selector('#my-checkbox');
    await t
        .click(checkbox)
        .expect(checkbox.checked).ok();

    Eyes.checkWindow('some name');


    // const {checkWindow, close} = await openEyes({testName: 'cafe'});
    //
    // const {url, resourceUrls, cdt, blobData, frames, blobs } = JSON.parse(await getResources());
    // const resources = blobs.reduce((acc, blob) => (acc[blob.url] = blob.value, acc), {});
    // const resourceContents = blobDataToResourceContents(blobData, resources);
    // const framesWithResources = createResourceContents(frames);
    //
    // checkWindow({url, resourceUrls, cdt, resourceContents, framesWithResources});
    //
    // await close();
});
