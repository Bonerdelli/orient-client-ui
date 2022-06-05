import { StoreProvider } from 'easy-peasy'

import 'orient-ui-library/styles/main.less'
import 'library/i18n'

import { store } from 'library/store'

import AppLayout from 'components/AppLayout'

import './App.style.less'

const App = () => (
  <StoreProvider store={store}>
    <AppLayout />
  </StoreProvider>
)

export default App
