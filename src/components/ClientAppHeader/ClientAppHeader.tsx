// import { useTranslation } from 'react-i18next'

import AppHeader from 'components/AppHeader' // TODO: from ui-lib

import './ClientAppHeader.style.less'

export interface ClientAppHeaderProps {

}

const ClientAppHeader: React.FC<ClientAppHeaderProps> = ({}) => {
  // const { t } = useTranslation()

  const renderMainAction = () => (
    <></>
  )
  return (
    <AppHeader mainAction={renderMainAction()} />
  )
}

export default ClientAppHeader
