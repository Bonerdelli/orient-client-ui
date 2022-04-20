import { useTranslation } from 'react-i18next'
import { Layout, Row, Col, Button, Tooltip } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'

import './AppHeader.style.less'
import Logo from 'orient-ui-library/assets/orient-logo.svg'
import config from 'config/portal.yaml'

const { Header } = Layout

const AppHeader = () => {
  const { sections } = config
  const { t } = useTranslation()
  console.log('Init sections', sections, t('shortTitle'))
  return (
    <Header className="AppHeader">
      <Row className="AppHeader__content" align="middle">
        <Col>
          <Logo className="AppHeader__logo" />
        </Col>
        <Col className="AppHeader__user"></Col>
        <Col className="AppHeader__actions">
          <Tooltip placement="bottomRight" mouseEnterDelay={1} title={t('common.user.actions.logout.title')}>
            <Button className="AppHeader__actions__button" type="link" icon={<LogoutOutlined />} />
          </Tooltip>
        </Col>
      </Row>
    </Header>
  )
}

export default AppHeader
