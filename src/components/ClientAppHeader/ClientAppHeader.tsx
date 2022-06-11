import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import AppHeader from 'components/AppHeader' // TODO: from ui-lib

import './ClientAppHeader.style.less'


export interface ClientAppHeaderProps {

}

const ClientAppHeader: React.FC<ClientAppHeaderProps> = ({}) => {
  const { t } = useTranslation()

  const renderMainAction = () => (
    <Button type="link" icon={<PlusOutlined />}>
      {t('orders.actionButton.title')}
    </Button>
  )
  return (
    <AppHeader mainAction={renderMainAction()} />
  )
}

export default ClientAppHeader
