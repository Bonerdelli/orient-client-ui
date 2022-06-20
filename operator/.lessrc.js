const yaml = require('js-yaml')
const fs = require('fs')

let theme = {}

try {
  theme = yaml.load(fs.readFileSync('./config/theme.yaml'))
} catch (e) {
  console.error('Error reading portal theme', e)
}

module.exports = {
  javascriptEnabled: true,
  modifyVars: theme,
}
