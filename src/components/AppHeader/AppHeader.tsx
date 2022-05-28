import { useTranslation } from 'react-i18next'
import { Layout, Row, Col, Typography, Avatar, Button } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'

import './AppHeader.style.less'
import Logo from 'orient-ui-library/assets/orient-logo.svg'

import { useStoreActions, useStoreState } from 'library/store'

const { Header } = Layout
const { Text } = Typography

const AppHeader = () => {
  const { setLogout } = useStoreActions(actions => actions.user)
  const user = useStoreState(state => state.user.current)
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
          <Button
            size="small"
            type="link"
            className="AppHeader__actions__button"
            icon={<LogoutOutlined />}
            onClick={setLogout}
          >
            <span className="AppHeader__actions__button__title">{t('common.user.actions.logout.title')}</span>
          </Button>
        </Col>
      </Row>
    </Header>
  )
}

export default AppHeader
