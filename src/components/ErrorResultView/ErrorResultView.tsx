import { useTranslation } from 'react-i18next'
import { Result, Button } from 'antd'

import { composeClasses } from 'library/helpers'
import Div from 'components/Div'

import './ErrorResultView.style.less'

type ErrorResultViewProps = {
  title?: string,
  message?: string,
  status?: 'error' | 'warning' | 403 | 404 | 500,
  reloadCallback?: () => void,
  centered?: boolean
}

const ErrorResultView: React.FC<ErrorResultViewProps> = ({
  title = 'common.errors.dataLoadingError.title',
  message = 'common.errors.dataLoadingError.desc',
  status = 'error',
  centered = false,
  reloadCallback,
}) => {
  const { t } = useTranslation()
  return (
    <Div className={composeClasses({
      ErrorResultView: true,
      'ErrorResultView--centered': centered,
    })}>
      <Result
        status={status}
        title={t(title)}
        subTitle={t(message)}
        extra={reloadCallback && [
          <Button key='reload' onClick={() => reloadCallback()}>
            {t('common.actions.reload.title')}
          </Button>,
        ]}
      />
    </Div>
  )
}

export default ErrorResultView
