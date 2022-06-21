import { useTranslation } from 'react-i18next'
import { Layout, Row, Col, Typography, Avatar, Button, Select } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'

import './AppHeader.style.less'
import Logo from 'orient-ui-library/assets/orient-logo.svg'

import Div from 'components/Div'

import { useStoreActions, useStoreState } from 'library/store'

const { Header } = Layout
const { Text } = Typography
const { Option } = Select

export interface AppHeaderProps {
  title?: string
  mainAction?: JSX.Element
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, mainAction }) => {
  const { setLogout } = useStoreActions(actions => actions.user)
  const user = useStoreState(state => state.user.current)
  const { t, i18n } = useTranslation()

  console.log('### user', user)

  const renderLangSwitcher = () => (
    <Select
      defaultValue={i18n.language}
      onChange={(lng) => i18n.changeLanguage(lng)}
      bordered={false}
    >
      <Option value='en'>Eng</Option>
      <Option value='ru'>Rus</Option>
    </Select>
  )

  return (
    <Header className="AppHeader">
      <Row className="AppHeader__content" align="middle" gutter={12}>
        <Col>
          <Logo className="AppHeader__logo" />
          {title && (
            <Div className="AppHeader__title" >
              {title}
            </Div>
          )}
        </Col>
        {mainAction && (
          <Col className="AppHeader__mainAction">
            {mainAction}
          </Col>
        )}
        <Col className="AppHeader__spacer" />
        <Col className="AppHeader__user">
          <Avatar className="AppHeader__user__avatar" icon={<UserOutlined />} />
          <Text className="AppHeader__user__name">{user?.name}</Text>
        </Col>
        <Col className="AppHeader__separator" />
        <Col className="AppHeader__actions">
          <Button
            size="small"
            type="link"
            className="AppHeader__actions__button"
            icon={<LogoutOutlined />}
            onClick={() => setLogout()}
          >
            <span className="AppHeader__actions__button__title">{t('common.user.actions.logout.title')}</span>
          </Button>
          {renderLangSwitcher()}
        </Col>
      </Row>
    </Header>
  )
}

export default AppHeader
