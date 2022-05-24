import React from 'react'
import { Result, Button } from 'antd'

type ErrorPageProps = {
  title?: string
  message?: string
  status?: 'error' | 'warning' | 403 | 404 | 500
  reloadCallback?: () => void
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'Ошибка загрузки данных',
  message = 'Во время загрузки данных произошла ошибка. Попробуйте обновить страницу',
  status = 'error',
  reloadCallback,
}) => (
  <Result
    status={status}
    title={title}
    subTitle={message}
    extra={reloadCallback && [
      <Button key="reload" onClick={() => reloadCallback()}>
        Перезагрузить
      </Button>,
    ]}
  />
)
