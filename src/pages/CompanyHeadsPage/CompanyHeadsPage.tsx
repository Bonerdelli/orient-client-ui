import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './CompanyHeadsPage.style.less'

const { Paragraph } = Typography

const CompanyHeadsPage = () => {
  const { t } = useTranslation()
  return (
    <div className="CompanyHeadsPage" data-testid="CompanyHeadsPage">
      <Paragraph>{t('CompanyHeadsPage.component')}</Paragraph>
    </div>
  )
}

export default CompanyHeadsPage
