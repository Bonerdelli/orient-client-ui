import { useTranslation } from 'react-i18next'
import { Result, Button } from 'antd'

import { composeClasses } from 'library/helpers/react'
import Div from 'components/Div'

import './ErrorResultView.style.less'

type ErrorResultViewProps = {
  title?: string
  message?: string
  actionTitle?: string
  status?: 'error' | 'warning' | 403 | 404 | 500
  actionCallback?: () => void
  centered?: boolean
  compact?: boolean
  fullHeight?: boolean
}

const ErrorResultView: React.FC<ErrorResultViewProps> = ({
  title = 'common.errors.dataLoadingError.title',
  message = 'common.errors.dataLoadingError.desc',
  actionTitle = 'common.actions.reload.title',
  status = 'error',
  centered = false,
  fullHeight = false,
  compact = false,
  actionCallback,
}) => {
  const { t } = useTranslation()
  return (
    <Div className={composeClasses({
      ErrorResultView: true,
      'ErrorResultView--centered': centered,
      'ErrorResultView--fullHeight': fullHeight,
      'ErrorResultView--compact': compact,
    })}>
      <Result
        status={status}
        title={t(title)}
        subTitle={t(message)}
        extra={actionCallback && [
          <Button size="large" type="primary" onClick={actionCallback}>
            {t(actionTitle)}
          </Button>,
        ]}
      />
    </Div>
  )
}

export default ErrorResultView
