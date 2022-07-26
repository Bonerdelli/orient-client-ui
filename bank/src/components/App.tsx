import { ConfigProvider, Alert } from 'antd'
import { StoreProvider } from 'easy-peasy'

// import enUS from 'antd/lib/locale/en_US' // TODO: add locale switcher
import ruRU from 'antd/lib/locale/ru_RU'

import 'orient-ui-library/styles/main.less'
import 'library/i18n'

import { store } from 'library/store'

import AppLayout from 'components/AppLayout'

const { ErrorBoundary } = Alert

const App = () => (
  <ConfigProvider locale={ruRU}>
    <StoreProvider store={store}>
      <ErrorBoundary showIcon>
        <AppLayout />
      </ErrorBoundary>
    </StoreProvider>
  </ConfigProvider>
)

export default App
