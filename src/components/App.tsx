import { StoreProvider, useStoreRehydrated } from 'easy-peasy'
import { Spin } from 'antd'

import 'orient-ui-library/styles/main.less'
import 'library/i18n'

import { store } from 'library/store'

import AppLayout from 'components/AppLayout'

import './App.style.less'


const App = () => {
  const isRehydrated = useStoreRehydrated()
  const renderLoading = () => (
    <div className="App__loader">
      <Spin size="large" />
    </div>
  )
  return (
    <StoreProvider store={store}>
      {isRehydrated ? <AppLayout /> : renderLoading() }
    </StoreProvider>
  )
}

export default App
