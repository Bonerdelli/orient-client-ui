import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './CompanyHeadsList.style.less'

const { Paragraph } = Typography

export interface CompanyHeadsListProps {

}

const CompanyHeadsList: React.FC<CompanyHeadsListProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="CompanyHeadsList" data-testid="CompanyHeadsList">
      <Paragraph>{t('CompanyHeadsList.component')}</Paragraph>
    </div>
  )
}

export default CompanyHeadsList
