const base = require('./base/v3');

module.exports = {
  ...base,
  browser_specific_settings: {
    gecko: {
      id: "browser@extension.com",
      strict_min_version: "42.0"
    }
  }
}