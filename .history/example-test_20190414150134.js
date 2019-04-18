import {Selector} from "testcafe";
import Eyes from 'eyes-testcafe';

fixture `Getting Started`
    .page `https://applitools.com/helloworld`
    .after(Eyes.after)
    .before(() =>
        Eyes.eyesOpen({
            appName: 'TestCafeApp',
            testName: 'Cafe',
            // browser: [
            //     {width: 800, height: 600, name: 'firefox'},
            //     {width: 1024, height: 768, name: 'chrome'}
            // ]
        })
    );

test('My App Test', async t => {
    // const checkbox = Selector('#my-checkbox');
    // await t
    //     .click(checkbox)
    //     .expect(checkbox.checked).ok();

    Eyes.eyesOpen({
        appName: 'TestCafeApp',
        testName: 'Cafe',
        // browser: [
        //     {width: 800, height: 600, name: 'firefox'},
        //     {width: 1024, height: 768, name: 'chrome'}
        // ]
    })
    
    Eyes.checkWindow('some name');
});
