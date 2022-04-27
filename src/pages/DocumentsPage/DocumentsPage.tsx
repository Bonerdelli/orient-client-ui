import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './DocumentsPage.style.less'

const { Paragraph } = Typography

const DocumentsPage = () => {
  const { t } = useTranslation()
  return (
    <div className="DocumentsPage" data-testid="DocumentsPage">
      <Paragraph>{t('DocumentsPage.component')}</Paragraph>
    </div>
  )
}

export default DocumentsPage
