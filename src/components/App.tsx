import { StoreProvider } from 'easy-peasy'
import { PersistGate } from 'redux-persist/integration/react'
import { Spin } from 'antd'

import { store, persistor } from 'library/store'

import AppLayout from 'components/AppLayout'

import 'library/i18n'
import './App.style.less'

const App = () => {

  const renderLoading = () => (
    <div className="App__loader">
      <Spin size="large" />
    </div>
  )
  return (
    <PersistGate loading={renderLoading()} persistor={persistor}>
      <StoreProvider store={store}>
        <AppLayout />
      </StoreProvider>
    </PersistGate>
  )
}

export default App
