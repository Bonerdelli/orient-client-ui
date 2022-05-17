import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './BankDetailsPage.style.less'

const { Paragraph } = Typography

const BankDetailsPage = () => {
  const { t } = useTranslation()
  return (
    <div className="BankDetailsPage" data-testid="BankDetailsPage">
      <Paragraph>{t('BankDetailsPage.component')}</Paragraph>
    </div>
  )
}

export default BankDetailsPage
