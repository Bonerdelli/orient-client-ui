import { Link } from 'react-router-dom'
import { Button, Col, Row, Space, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import './WizardHeader.style.less'

const { Title, Text } = Typography

export interface WizardHeaderProps {
  title: string
  backUrl?: string
  statusTag: JSX.Element
  username?: string
}

const WizardHeader: React.FC<WizardHeaderProps> = ({
  title,
  backUrl,
  statusTag,
  username,
}) => (
  <Row className="WizardHeader" align="middle">
    <Col span={16}>
      {backUrl && (
        <Link className="WizardHeader__navigateBack" to={backUrl}>
          <Button icon={<ArrowLeftOutlined/>} type="link" size="large"></Button>
        </Link>
      )}
      <Title className="WizardHeader__title" level={3}>{title}</Title>
    </Col>

    <Col className="WizardHeader__status" span={8} style={{ textAlign: 'right' }}>
      <Space>
        {username && <Text className="WizardHeader__username">{username}</Text>}
        {statusTag}
      </Space>
    </Col>
  </Row>
)

export default WizardHeader
