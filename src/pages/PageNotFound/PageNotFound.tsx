import React from 'react'
import { useTranslation } from 'react-i18next'
import { Result, Button } from 'antd'

type PageNotFoundProps = {
  title?: string
  message?: string
  navigateBackLabel?: string
  navigateBack?: () => void
}

const PageNotFound: React.FC<PageNotFoundProps> = ({
  title = 'common.errors.pageNotFound.title',
  message = 'common.errors.pageNotFound.desc',
  navigateBackLabel = 'common.errors.pageNotFound.action',
  navigateBack,
}) => {
  const { t } = useTranslation()
  return (
    <Result
      status="404"
      title={t(title)}
      subTitle={t(message)}
      extra={navigateBack && [
        <Button key="reload" onClick={() => navigateBack()}>
          {t(navigateBackLabel)}
        </Button>,
      ]}
    />
  )
}

export default PageNotFound
