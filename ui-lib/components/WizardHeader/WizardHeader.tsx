import { Link } from 'react-router-dom'
import { Row, Col, Typography, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import './WizardHeader.style.less'

const { Title } = Typography

export interface WizardHeaderProps {
  title: string
  backUrl?: string
  statusTag: JSX.Element
}

const WizardHeader: React.FC<WizardHeaderProps> = ({
  title,
  backUrl,
  statusTag,
}) => (
  <Row className="WizardHeader" align="middle">
    <Col span={20}>
      {backUrl && (
        <Link className="WizardHeader__navigateBack" to={backUrl}>
          <Button icon={<ArrowLeftOutlined />} type="link" size="large"></Button>
        </Link>
      )}
      <Title className="WizardHeader__title" level={3}>{title}</Title>
    </Col>
    <Col className="WizardHeader__status" span={4} style={{ textAlign: 'right' }}>
      {statusTag}
    </Col>
  </Row>
)

export default WizardHeader
