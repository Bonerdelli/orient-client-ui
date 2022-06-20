import { useTranslation } from 'react-i18next'
import { Layout, Typography } from 'antd'

import './TemplateName.style.less'

const { Paragraph } = Typography

export const TemplateName = () => {
  const { t } = useTranslation()
  return (
    <Layout className="TemplateName" data-testid="TemplateName">
      <Paragraph>{t('TemplateName.component')}</Paragraph>
    </Layout>
  )
}
