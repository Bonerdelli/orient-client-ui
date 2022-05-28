import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Button, Space, Typography } from 'antd'

import { AuthResult, auth } from 'orient-ui-library' // TODO: migrate to ui-lib, make local import
// import { User } from 'orient-ui-library' // TODO: migrate to ui-lib, make local import

import './LoginForm.style.less'

const { Item: FormItem } = Form
const { Password } = Input
const { Text } = Typography

export interface LoginFormProps {
  // onLogin: (user: User) => void // TODO: retrieve current user from JWT
  onLogin: (user: AuthResult) => void
}

interface FormValue {
  login: string
  password: string
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {

  const { t } = useTranslation()
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ authError, setAuthError ] = useState<boolean>(false)
  const [ completed, setCompleted ] = useState<boolean>(false)

  const handleSubmit = (values: FormValue) => {
    setAuthError(false)
    setSubmitting(true)
    const { login, password } = values
    handleLogin(login, password)
  }

  const handleLogin = async (login: string, password: string) => {
    const result = await auth(login, password)
    if (!result) {
      setSubmitting(false)
      setAuthError(true)
      return
    }
    onLogin(result as AuthResult)
    setCompleted(true)
  }

  // TODO: use or remove
  // const renderAuthError = () => (
  //   <Alert
  //     message={t('common.errors.authError.title')}
  //     description={t('common.errors.authError.desc')}
  //     type="error"
  //   />
  // )

  return (
    <Form
      name="authForm"
      className="LoginForm"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      requiredMark={false}
      colon={false}
      size="large"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <FormItem
        label={t('common.forms.authenticate.login.label')}
        name="login"
        rules={[{
          required: true,
          message: t('common.forms.authenticate.login.validation.required'),
        }]}
      >
        <Input disabled={completed} />
      </FormItem>

      <FormItem
        label={t('common.forms.authenticate.password.label')}
        name="password"
        rules={[{
          required: true,
          message: t('common.forms.authenticate.password.validation.required'),
        }]}
      >
        <Password disabled={completed} />
      </FormItem>

      <FormItem wrapperCol={{ offset: 8, span: 16 }}>
        <Space direction="horizontal">
          <Button
            htmlType="submit"
            type="primary"
            className="LoginForm__button"
            disabled={submitting || completed}
            danger={authError}
            block
          >
            {t('common.user.actions.login.title')}
          </Button>
          {authError && (
            <Text type="danger">{t('common.errors.authError.title')}</Text>
          )}
        </Space>
      </FormItem>
    </Form>
  )
}

export default LoginForm
