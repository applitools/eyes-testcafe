'use strict';
/* global navigator */

const {ClientFunction} = require('testcafe');
const doGetuserAgent = ClientFunction(() => navigator.userAgent);

async function getUserAgent({t, logger}) {
  const userAgentWithT = doGetuserAgent.with({boundTestRun: t});
  const userAgent = await userAgentWithT();
  logger.log('got user agent', userAgent);
  return userAgent;
}

module.exports = getUserAgent;
