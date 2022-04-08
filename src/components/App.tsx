import { StoreProvider } from 'easy-peasy'
import { PersistGate } from 'redux-persist/integration/react'
import { Spin } from 'antd'

import HomePage from 'pages/HomePage'

import { store, persistor } from 'library/store'

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
        <HomePage />
      </StoreProvider>
    </PersistGate>
  )
}

export default App
