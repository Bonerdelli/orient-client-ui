import { Button, Card, Layout, Spin, Typography } from 'antd'
import { useStoreState } from 'library/store'
import './QuestionnairePage.style.less'
import { Div } from 'orient-ui-library/components'
import QuestionnaireForm from 'components/QuestionnaireForm'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { RETURN_URL_PARAM } from 'library/constants'
import { ArrowLeftOutlined } from '@ant-design/icons'

const QuestionnairePage = () => {
  const { Title } = Typography
  const { t } = useTranslation()
  const company = useStoreState(state => state.company.current)
  const { search } = useLocation()
  const returnUrl = new URLSearchParams(search).get(RETURN_URL_PARAM)

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large"/>
      </Div>
    )
  }

  return (
    <Layout className="QuestionnairePage">
      <Card title={<>
        {returnUrl &&
          <Link to={returnUrl}>
            <Button icon={<ArrowLeftOutlined/>} type="link" size="large">
              {t('questionnaire.backToOrder')}
            </Button>
          </Link>
        }
        <Title level={3} style={{ display: 'inline-block' }}>
          {t('sections.questionnaire.title')}
        </Title>
      </>}
      >

        <QuestionnaireForm companyId={String(company.id)}
                           returnUrl={returnUrl}/>
      </Card>
    </Layout>
  )
}

export default QuestionnairePage
