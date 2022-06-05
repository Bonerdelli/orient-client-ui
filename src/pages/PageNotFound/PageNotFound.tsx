import React from 'react'
import { Result, Button } from 'antd'

type PageNotFoundProps = {
  title: string
  message: string
  navigateBackLabel: string
  navigateBack?: () => void
}

const PageNotFound: React.FC<PageNotFoundProps> = ({
  title = '404',
  message = 'Запрашиваемая страница не найдена',
  navigateBackLabel = 'На главную',
  navigateBack,
}) => (
  <Result
    status="404"
    title={title}
    subTitle={message}
    extra={navigateBack && [
      <Button key="reload" onClick={() => navigateBack()}>
        {navigateBackLabel}
      </Button>,
    ]}
  />
)

export default PageNotFound
