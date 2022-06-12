import { useTranslation } from 'react-i18next'
import { Empty } from 'antd'

const EmptyResult: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={t('common.forms.select.noData')}
    />
  )
}

export default EmptyResult
