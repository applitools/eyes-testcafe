/// <reference path="./eyes.ts" />

export default class Eyes {
  /**
   * Create Eyes instance.
   * @example 
   * const eyes = new Eyes();
  */
  constructor(prop?: {configPath?: string})
  
  /**
   * Create an Applitools test.
   * This will start a session with the Applitools server.
   * @example
   * await eyes.open({ appName: 'My App', t })
  */
  open(options?: Eyes.Testcafe.OpenOptions): Promise<any>

  /**
   * Generate a screenshot of the current page and add it to the Applitools Test.
   * @example 
   * await eyes.checkWindow()
   *
   * OR
   *
   * await eyes.checkWindow({
   *  target: 'region',
   *  selector: '.my-element' 
   * });
  */
  checkWindow(config: Eyes.Testcafe.CheckOptions): Promise<any>

  /**
   * Close the applitools test and check that all screenshots are valid.
   * @example await eyes.close()
  */
  close(): Promise<null>

  /**
   * Wait until all tests in the fixture are completed and return their results.
   * Note that if you don't wait for the tests to be completed then in case of a visual test failure, eyes cannot fail the fixture.
   * it is recommended to wait for the results in the testcafe after() hook.
   * 
   * @example await eyes.close()
  */
  waitForResults(rejectOnErrors?:boolean): Promise<any[]>
}