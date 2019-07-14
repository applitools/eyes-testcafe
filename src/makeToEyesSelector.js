'use strict';
/* global element */

function makeToEyesSelector(t) {
  return async function(selector) {
    const xpath = await t.eval(
      () => {
        let el = element();
        let xpath = '';
        do {
          let parent = el.parentElement;
          let index = 1;
          if (parent !== null) {
            let children = parent.children;
            for (let childIdx in children) {
              let child = children[childIdx];
              if (child === el) break;
              if (child.tagName === el.tagName) index++;
            }
          }
          xpath = `/${el.tagName}[${index}]${xpath}`;
          el = parent;
        } while (el !== null);
        return `/${xpath}`;
      },
      {dependencies: {element: selector}},
    );
    return {type: 'xpath', selector: xpath};
  };
}

module.exports = makeToEyesSelector;
