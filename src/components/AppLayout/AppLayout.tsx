import { BrowserRouter } from 'react-router-dom'

import AppLayoutPublic from './AppLayoutPublic'
import AppLayoutProtected from './AppLayoutProtected'

const AppLayout = () => {
  const authenticated = true // TODO: use store state
  return (
    <BrowserRouter>
      {authenticated ? <AppLayoutProtected /> : <AppLayoutPublic />}
    </BrowserRouter>
  )
}

export default AppLayout
