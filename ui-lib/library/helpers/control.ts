import themeConfig from 'config/theme-common.yaml'

export const getControlColorByState = (state: boolean | null) => {
  if (state === true) {
    return themeConfig['control-color-success']
  }
  if (state === false) {
    return themeConfig['control-color-danger']
  }
  return themeConfig['control-color-inactive']
}
