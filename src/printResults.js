'use strict';
const chalk = require('chalk');
const flat = require('./flat');

function printResults(results) {
  let outputStr = '\n';
  const combinedResults = flat(results);
  const testResults = combinedResults.filter(result => !(result instanceof Error));
  const errors = combinedResults.filter(result => result instanceof Error);

  let exitCode = errors.length ? 1 : 0;
  if (testResults.length > 0) {
    outputStr += '[EYES: TEST RESULTS]:\n';
    testResults.forEach(result => {
      if (!result.id) {
        return;
      }

      const title = `${result.getName()} [${result.getHostDisplaySize().toString()}] - `;
      if (result.getIsNew()) {
        outputStr += `${title}${chalk.blue('New')}\n`;
      } else if (result.isPassed()) {
        outputStr += `${title}${chalk.green('Passed')}\n`;
      } else {
        const stepsFailed = result.getMismatches() + result.getMissing();
        outputStr += `${title}${chalk.red(`Failed ${stepsFailed} of ${result.getSteps()}`)}\n`;
        exitCode = exitCode || 1;
      }
    });
  } else if (!errors.length) {
    outputStr += 'Test is finished but no results returned.\n';
  }

  if (errors.length) {
    outputStr += '\nThe following errors were found:\n';
    outputStr += errors.map(err => chalk.red(err.toString())).join('\n');
  }

  const nonEmptyResult = testResults.find(tr => tr.getStatus());
  if (nonEmptyResult) {
    const diffCount = testResults.filter(result => !result.getIsNew() && !result.isPassed()).length;
    if (diffCount) {
      outputStr += chalk.red(`
A total of ${diffCount} difference${diffCount > 1 ? 's were' : ' was'} found.`);
    } else {
      outputStr += chalk.green(`
No differences were found!`);
    }
    outputStr += `\n
See details at ${nonEmptyResult.getAppUrls().getBatch()}\n`;
  }

  if (!nonEmptyResult && !errors.length) {
    outputStr += chalk.yellow(
      `\nYour tests do not contain visual checks! make sure that the test conatains 'eyes.checkWindow' calls and that they are awaited upon.\n`,
    );
  }

  console.log(outputStr);
}

module.exports = printResults;
