# Eyes-Testcafe

Applitools Eyes SDK for [Testcafe](https://devexpress.github.io/testcafe/).

## Installation

Install Eyes-Testcafe as a local dev dependency in your tested project:

```bash
npm i -D @applitools/eyes-testcafe
```

## Applitools API key

In order to authenticate via the Applitools server, you need to supply the Eyes-Testcafe SDK with the API key you got from Applitools. Read more about how to obtain the API key [here](https://applitools.com/docs/topics/overview/obtain-api-key.html).

To to this, set the environment variable `APPLITOOLS_API_KEY` to the API key before running your tests.
For example, on Linux/Mac:

```bash
export APPLITOOLS_API_KEY=<your_key>
npx testcafe chrome:headless tests
```

And on Windows:

```bash
set APPLITOOLS_API_KEY=<your_key>
npx testcafe chrome:headless tests
```

It's also possible to specify the API key in the `applitools.config.js` file. The property name is `apiKey`. For example:

```js
module.exports = {
  apiKey: 'YOUR_API_KEY',
  ...
}
```

See the [Advanced configuration](#method-3-the-applitoolsconfigjs-file) section below for more information on using the config file.

## Usage

After defining the API key, you will be able to use commands from Eyes-Testcafe in your testcafe tests to take screenshots and use Applitools Eyes to manage them:

### Example

```js
import Eyes from '@applitools/eyes';
const eyes = new Eyes();

fixture`Hello world`
  .page('https://applitools.com/helloworld')
  .afterEach(async () => eyes.close());
  .after(async () => eyes.waitForResults())
  
test('Cookies', async t => {
  await eyes.open({
      appName: 'Hello World!',
      testName: 'My first JavaScript test!',
      browser: [{ width: 800, height: 600, name: 'firefox' }],
      t
  });
  await eyes.checkWindow('Main Page');
  await t.click('button')
  await eyes.checkWindow('Click!');
});
```

# API

### **open**

Create an Applitools test.
This will start a session with the Applitools server.

```js
eyes.open({
  appName: '',
  testName: '',
  t
});
```

It's possible to pass a config object to `open` with all the possible configuration properties. Read the [Advanced configuration](#advanced-configuration) section for a detailed description.

### **checkWindow**

Generate a screenshot of the current page and add it to the Applitools Test.

```js
eyes.checkWindow(tag)

OR

eyes.checkWindow({ tag: 'your tag', sizeMode: 'your size mode' })
```

##### Arguments to `eyes.checkWindow`

- `tag` (optional): A logical name for this check.
- `sizeMode` (optional): Possible values are:

  - **`full-page`**: This is the default value. It means a screenshot of everything that exists in the DOM at the point of calling `checkWindow` will be rendered.
  - **`viewport`**: Only a screenshot the size of the browser will be rendered (the size of the browser can be set in the call to `eyes.open` - see [Advanced configuration](#advanced-configuration) below).
  - **`selector`**: Take a screenshot of the content of the element targeted by css or xpath selector. It's necessary to specify the value of the selector in the `selector` argument.
  - **`region`**: Take a screenshot of a region of the page, specified by coordinates. It's necessary to specify the value of the region in the `region` argument.

- `selector` (optional): In case `sizeMode` is `selector`, this should be the actual css or xpath selector to an element, and the screenshot would be the content of that element. For example:

    ```js
    // Using a css selector
    eyes.checkWindow({
      sizeMode: 'selector',
      selector: {
        type: 'css',
        selector: '.my-element' // or '//button'
      }
    });
    
    // Using an xpath selector
    eyes.checkWindow({
      sizeMode: 'selector',
      selector: {
        type: 'xpath',
        selector: '//button[1]'
      }
    });
    
    // The shorthand string version defaults to css selectors
    eyes.checkWindow({
      sizeMode: 'selector',
      selector: '.my-element'
    });
    ```

- `region` (optional): In case `sizeMode` is `region`, this should be an object describing the region's coordinates. For example:

    ```js
    eyes.checkWindow({
      sizeMode: 'region',
      region: {top: 100, left: 0, width: 1000, height: 200}
    });
    ```

- `ignore` (optional): A single or an array of regions to ignore when checking for visual differences. For example:

    ```js
    eyes.checkWindow({
      ignore: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-ignore'}
      ]
    });
    ```

- `floating` (optional): A single or an array of floating regions to ignore when checking for visual differences. More information about floating regions can be found in Applitools docs [here](https://help.applitools.com/hc/en-us/articles/360006915292-Testing-of-floating-UI-elements). For example:

    ```js
    eyes.checkWindow({
      floating: [
        {top: 100, left: 0, width: 1000, height: 100, maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20},
        {selector: '.some-div-to-float', maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20}
      ]
    });
    ```

- `layout` (optional): A single or an array of regions to match as [layout level.](https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels) For example:

    ```js
    eyes.checkWindow({
      layout: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-test-as-layout'}
      ]
    });
    ```

- `strict` (optional): A single or an array of regions to match as [strict level.](https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels) For example:

    ```js
    eyes.checkWindow({
      strict: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-test-as-strict'}
      ]
    });
    ```

- `scriptHooks` (optional): A set of scripts to be run by the browser during the rendering. It is intended to be used as a means to alter the page's state and structure at the time of rendering.
  An object with the following properties:
    - `beforeCaptureScreenshot`: a script that runs after the page is loaded but before taking the screenshot. For example:
        
        ```js
        eyes.checkWindow({
          scriptHooks: {
            beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'"
          }
        })
        ```

- `sendDom` (optional): A flag to specify whether a capture of DOM and CSS should be taken when rendering the screenshot. The default value is true. This should only be modified to troubleshoot unexpected behavior, and not for normal production use.

    ```js
    eyes.checkWindow({sendDom: false})
    ```

### **close**

Close the applitools test and check that all screenshots are valid.

It is important to call this at the end of each test, symmetrically to `open`(or in `afterEach()`, see [Best practice for using the SDK](#best-practice-for-using-the-sdk)).

Close receives no arguments.

```js
eyes.close();
```

### **waitForResults**
Wait untill all tests in the fixture are completed and return their results.
Note that if you don't wait for the tests to be completed then in case of a visual test failure, eyes cannot fail the fixture.
* it is recommended to wait for the resulsts in the tescafe `after()` hook. 

```js
await eyes.waitForResults()
```

waitForResults receives `rejectOnErrors`,
* If `true` (default) and a visual test fails then reject with an `Error` (in case of a general error reject as well).
If the rejection is not handled then Testcafe fails the fixture.
* If `false` and a visual test fails then `waitForResults` resolves with an `Error`.
In case of a general `Error` reject with the `Error`. 

In case all the tests passed then waitForResults resolves with the test results.
<!-- resolves with an Array, each element in the array represents a test (testcafe test, i.e. open checkWindow and close) and is an Array of TestResulst. Each TestResulst is a visual test environement. -->
___
<br/>

## Best practice for using the SDK

Every call to `eyes.open` and `eyes.close` defines a test in Applitool Eyes, and all the calls to `eyes.checkWindow` between them are called "steps". In order to get a test structure in Applitools that corresponds to the test structure in Testcafe, it's best to open/close tests in every `test` call. **You can use `afterEach` for calling `eyes.close()`**

Also note that after all tests are done you should call eyes.waitForResults, **you can use `aftre()` for calling `eyes.waitForResults`**, this is is done for two reasons:
1. to signal testcafe to wait untill all the tests have been completed.
2. to obtain test results if needed.

```js
fixture`Hello world`
  .page('https://applitools.com/helloworld')
  .afterEach(async () => eyes.close());
  .after(async () => eyes.waitForResults())
```

Applitools will take screenshots and perform the visual comparisons in the background. Performance of the tests will not be affected during the test run, but there will be a small phase at the end of the test run that waits for visual tests to end.
___
<br/>

## Concurrency


The default level of concurrency for free accounts is `1`. This means that visual tests will not run in parallel during your tests, and will therefore be slow.
If your account does support a higher level of concurrency, it's possible to pass a different value by specifying it in the property `concurrency` in the applitools.config.js file (see [Advanced configuration](#advanced-configuration) section below).

If you are interested in speeding up your visual tests, contact sdr@applitools.com to get a trial account and faster tests with more concurrency.
___
<br/>

## Advanced configuration

There are 3 ways to specify test configuration:
1) Arguments to `eyes.open()`
2) Environment variables
3) The `applitools.config.js` file

The list above is also the order of precedence, which means that if you pass a property to `eyes.open` it will override the environment variable, and the environment variable will override the value defined in the `applitools.config.js` file.

Here are the available configuration properties:

| Property name             | Default value               | Description   |
| -------------             |:-------------               |:-----------   |
| `testName`                | undefined | The test name |
| `browser`                 | { width: 800, height: 600, name: 'chrome' } | The size and browser of the generated screenshots. This doesn't need to be the same as the browser that Testcafe is running. It could be a different size and also a different browser. Currently, `firefox`, `chrome`, `edge`, `ie10` and `ie11` are supported. For more info, see the [browser section below](#configuring-the-browser).|
| `batchId`                 | random                      | Provides ability to group tests into batches. Read more about batches [here](https://applitools.com/docs/topics/working-with-test-batches/how-to-group-tests-into-batches.html). |
| `batchName`               | The name of the first test in the batch                   | Provides a name to the batch (for display purpose only). |
| `baselineEnvName`         | undefined                   | The name of the environment of the baseline. |
| `envName`                 | undefined                   | A name for the environment in which the application under test is running. |
| `ignoreCaret`             | false                       | Whether to ignore or the blinking caret or not when comparing images. |
| `matchLevel`              | Strict                      | The method to use when comparing two screenshots, which expresses the extent to which the two images are expected to match. Possible values are `Strict`, `Exact`, `Layout` and `Content`. Read more about match levels [here](http://support.applitools.com/customer/portal/articles/2088359). |
| `baselineBranchName`      | undefined                   | The name of the baseline branch. |
| `parentBranchName`        | undefined                   | Sets the branch under which new branches are created. |
| `saveFailedTests`         | false                       | Set whether or not failed tests are saved by default. |
| `saveNewTests`            | false                       | Set whether or not new tests are saved by default. |
| `properties`              | undefined                   | Custom properties for the eyes test. The format is an array of objects with name/value properties. For example: `[{name: 'My prop', value:'My value'}]`. |
| `compareWithParentBranch` | false                       |  |
| `ignoreBaseline`          | false                       |  |
<br/>

The following configuration properties cannot be defined using the first method of passing them to `eyes.open`. They should be defined either in the `applitools.config.js` file or as environment variables.

| Property name             | Default value               | Description   |
| -------------             |:-------------               |:-----------   |
| `apiKey`                  | undefined                   | The API key used for working with the Applitools Eyes server. See more info in the [Applitools API key](#applitools-api-key) section above |
| `showLogs`                | false                       | Whether or not you want to see logs. Logs are written to the same output of the Testcafe process. <br/><br/>_Note that you can also use [DEBUG=eyes*](https://github.com/visionmedia/debug) for debugging._|
| `serverUrl`               | Default Eyes server URL     | The URL of Eyes server |
| `proxy`                   | undefined                   | Sets the proxy settings to be used in network requests to Eyes server. This can be either a string to the proxy URI, or an object containing the URI, username and password.<br/><br/>For example:<br/>`{uri: 'https://myproxy', username: 'my_user', password: 'my_password'}`|
| `isDisabled`              | false                       | If true, all api calls to Eyes-Testcafe are ignored. |
| `failTestcafeOnDiff`       | true                        | If true, then the Testcafe test fails if an eyes visual test fails. If false and an eyes test fails, then the Testcafe test does not fail. 
| `tapDirPath`              | undefined                   | Directory path of a results file. If set, then a [TAP](https://en.wikipedia.org/wiki/Test_Anything_Protocol#Specification) file is created in this directory, the tap file name is created with the name eyes-[\<ISO-DATE\>](https://en.wikipedia.org/wiki/ISO_8601)\.tap and contains the Eyes test results <br><br/> _Note that results are scoped per spec file, this means that the results file is created once for each fixture file)._|
| `concurrency`             | 1                           | The maximum number of tests that can run concurrently. The default value is the allowed amount for free accounts. For paid accounts, set this number to the quota set for your account. |

### Method 1: Arguments for `eyes.open`

Pass a config object as the only argument. For example:

```js
eyes.open({
  appName: 'My app',
  batchName: 'My batch',
  ...
  // all other configuration variables apply
})
```

### Method 2: Environment variables

The name of the corresponding environment variable is in uppercase, with the `APPLITOOLS_` prefix, and separating underscores instead of camel case:

```js
APPLITOOLS_APP_NAME
APPLITOOLS_SHOW_LOGS
APPLITOOLS_BATCH_NAME
APPLITOOLS_CONCURRENCY
APPLITOOLS_SAVE_DEBUG_DATA
APPLITOOLS_BATCH_ID
APPLITOOLS_BATCH_NAME
APPLITOOLS_BASELINE_ENV_NAME
APPLITOOLS_ENV_NAME
APPLITOOLS_IGNORE_CARET
APPLITOOLS_IS_DISABLED
APPLITOOLS_MATCH_LEVEL
APPLITOOLS_MATCH_TIMEOUT
APPLITOOLS_BRANCH_NAME
APPLITOOLS_BASELINE_BRANCH_NAME
APPLITOOLS_PARENT_BRANCH_NAME
APPLITOOLS_SAVE_FAILED_TESTS
APPLITOOLS_SAVE_NEW_TESTS
APPLITOOLS_COMPARE_WITH_PARENT_BRANCH
APPLITOOLS_IGNORE_BASELINE
APPLITOOLS_SERVER_URL
```

### Method 3: The `applitools.config.js` file

It's possible to have a file called `applitools.config.js` at the same folder location as `.testcaferc.json`. _(The directory from which you run TestCafe. This is usually the project's root directory)_. <br>In this file specify the desired configuration, in a valid JSON format. For example:

```js
module.exports = {
  appName: 'My app',
  showLogs: true,
  batchName: 'My batch'
  ...
  // all other configuration variables apply
}
```
<br/>

## Configuring the browser

Eyes-Testcafe will take a screenshot of the page in the requested browser, the browser can be set in the `applitools.config.js` or by passing it to `eyes.open`.

It's also possible to send an array of browsers, for example:

```js
eyes.open({
  ...
  browser: [
    {width: 800, height: 600, name: 'firefox'},
    {width: 1024, height: 768, name: 'chrome'},
    {width: 1024, height: 768, name: 'ie11'}
  ]
}
```
**Note**: that if only a single browser is set, then Eyes-Testcafe changes the testcafe's browser viewport to that size.  

### Device emulation

To enable chrome's device emulation, it's possible to send a device name and screen orientation, for example:

```js
eyes.open({
  ...
  browser: {
    deviceName: 'iPhone X',
    screenOrientation: 'landscape',
    name: 'chrome' // optional, just to make it explicit this is browser emulation and not a real device. Only chrome is supported for device emulation.
  }
}
```

Possible values for screen orientation are `landscape` and `portrait`, and if no value is specified, the default is `portrait`.

The list of device names is taken from [chrome devtools predefined devices](https://raw.githubusercontent.com/chromium/chromium/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/devtools/front_end/emulated_devices/module.json), and can be obtained by running the following command in a unix-based shell (installing [`jq`](https://stedolan.github.io/jq/) might be needed):

```sh
curl -s https://raw.githubusercontent.com/chromium/chromium/0aee4434a4dba42a42abaea9bfbc0cd196a63bc1/third_party/blink/renderer/devtools/front_end/emulated_devices/module.json | jq '.extensions[].device.title'
```

In addition, it's possible to use chrome's device emulation with custom viewport sizes, pixel density and mobile mode, by passing `deviceScaleFactor` and `mobile` in addition to `width` and `height`. For example:

```js
eyes.open({
  ...
  browser: {
    width: 800,
    height: 600,
    deviceScaleFactor: 3,
    mobile: true,
    name: 'chrome' // optional, just to make it explicit this is browser emulation and not a real device. Only chrome is supported for device emulation.
  }
}
```
___
## Troubleshooting

* If issues occur, DEBUG_SAVE=1 env variable can be set to save helpful information. The information will be saved under a folder named `.debug` in the current working directory. This could be then used for getting support on your issue.
 * You can also use [DEBUG=eyes*](https://github.com/visionmedia/debug) for debugging.
