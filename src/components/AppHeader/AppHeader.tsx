import { useTranslation } from 'react-i18next'
import { Layout, Row, Col, Typography, Avatar, Button } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'

import './AppHeader.style.less'
import Logo from 'orient-ui-library/assets/orient-logo.svg'

import { useStoreState } from 'library/store'

const { Header } = Layout
const { Text } = Typography

const AppHeader = () => {
  const user = useStoreState(state => state.user.currentUser)
  const { t } = useTranslation()
  return (
    <Header className="AppHeader">
      <Row className="AppHeader__content" align="middle" gutter={12}>
        <Col>
          <Logo className="AppHeader__logo" />
        </Col>
        <Col className="AppHeader__spacer" />
        <Col className="AppHeader__user">
          <Avatar className="AppHeader__user__avatar" icon={<UserOutlined />} />
          <Text className="AppHeader__user__name">{user?.fullName}</Text>
        </Col>
        <Col className="AppHeader__separator" />
        <Col className="AppHeader__actions">
          <Button size="small" className="AppHeader__actions__button" type="link" icon={<LogoutOutlined />}>
            <span className="AppHeader__actions__button__title">{t('common.user.actions.logout.title')}</span>
          </Button>
        </Col>
      </Row>
    </Header>
  )
}

export default AppHeader
