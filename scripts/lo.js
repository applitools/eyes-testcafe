// log-opener
const path = require('path');
const fs = require('fs');
const log = fs
  .readFileSync(path.resolve(process.argv[2]), {
    encoding: 'utf-8',
  })
  .split('\n');
if (!log) throw new Error('Unable to read provided log file');

function filterRenderRequest() {
  const renderRequestRaw = log.find(l => l.includes('with RenderRequest')).match(/{ (.*) }/);
  if (renderRequestRaw) return JSON.parse(renderRequestRaw[1].replace(/\t/, ''));
}

function filterResources(renderRequest) {
  let resources = [];
  Object.entries(renderRequest.resources).forEach(resource => {
    const url = resource[0];
    const result = resource[1];
    if (result && result.errorStatusCode) resources.push({[url]: result});
    else resources.push(url);
  });
  return resources;
}

function filterBadResources(renderRequest) {
  return filterResources(renderRequest).filter(resource => {
    return typeof resource === 'object';
  });
}

function displayBadResources(renderRequest) {
  const resources = filterBadResources(renderRequest);
  if (resources.length) {
    resources.forEach(resource => {
      const url = Object.keys(resource)[0];
      const {errorStatusCode} = Object.values(resource)[0];
      console.log(`${errorStatusCode}: ${url}`);
    });
  }
}

function filterGoodResources(renderRequest) {
  return filterResources(renderRequest).filter(resource => {
    return typeof resource === 'string';
  });
}

function displayGoodResources(renderRequest) {
  const resources = filterGoodResources(renderRequest);
  if (resources.length) {
    resources.forEach(resource => {
      console.log('200: ' + resource);
    });
  }
}

function displayResourcesSummary(renderRequest) {
  console.log('');
  console.log(`${Object.keys(renderRequest.resources).length} total resources`);
  console.log(`- ${filterBadResources(renderRequest).length} incomplete`);
  console.log(`- ${filterGoodResources(renderRequest).length} complete`);
}

const renderRequest = filterRenderRequest();
displayBadResources(renderRequest);
displayGoodResources(renderRequest);
displayResourcesSummary(renderRequest);
