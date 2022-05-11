import { CheckCircleOutlined } from '@ant-design/icons'

export const renderBinaryCell = (value: boolean | string | number | null): JSX.Element => (
  !!value ? <CheckCircleOutlined /> : <></>
)
