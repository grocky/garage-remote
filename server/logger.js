const path = require('path');

/**
 * @param {object} callingModule
 * @return {string}
 */
const buildLabel = ({ callingModule }) => {
  const directory = callingModule.filename.split(path.sep).pop();
  const basename = path.basename(callingModule.filename);
  return `${(new Date()).toISOString()} [${path.join(directory, basename)}]`;
};

/**
 * @param {object} module - The file's module
 * @return {function(message): void}
 */
module.exports = (module) =>
  (message) => {
    console.log(`${buildLabel({ callingModule: module })} - ${message}`);
  };
