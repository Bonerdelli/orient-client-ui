const yaml = require('js-yaml')
const fs = require('fs')

module.exports = {
  javascriptEnabled: true,
  // modifyVars: yaml.load(fs.readFileSync('orient-ui-library/config/theme.yaml')),
  modifyVars: {
    'primary-color': '#1DA57A',
    'layout-header-height': '24px',
  }
}
