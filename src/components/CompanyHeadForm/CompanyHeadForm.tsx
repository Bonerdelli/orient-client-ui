import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './CompanyHeadForm.style.less'

const { Paragraph } = Typography

export interface CompanyHeadFormProps {

}

const CompanyHeadForm: React.FC<CompanyHeadFormProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="CompanyHeadForm" data-testid="CompanyHeadForm">
      <Paragraph>{t('CompanyHeadForm.component')}</Paragraph>
    </div>
  )
}

export default CompanyHeadForm
