import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './CompanyContactsForm.style.less'

const { Paragraph } = Typography

const CompanyContactsForm = () => {
  const { t } = useTranslation()
  return (
    <div className="CompanyContactsForm" data-testid="CompanyContactsForm">
      <Paragraph>{t('CompanyContactsForm.component')}</Paragraph>
    </div>
  )
}

export default CompanyContactsForm
