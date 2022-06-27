import { Card, Layout, Spin, Typography } from 'antd'
import { useStoreState } from 'library/store'
import './QuestionnairePage.style.less'
import { Div } from 'orient-ui-library/components'
import QuestionnaireForm from 'components/QuestionnaireForm'
import { useTranslation } from 'react-i18next'

const QuestionnairePage = () => {
  const { Title } = Typography
  const { t } = useTranslation()
  const company = useStoreState(state => state.company.current)

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large"/>
      </Div>
    )
  }

  return (
    <Layout className="QuestionnairePage">
      <Card title={<Title level={3}>
        {t('sections.questionnaire.title')}
      </Title>}>

        <QuestionnaireForm companyId={String(company.id)}/>
      </Card>
    </Layout>
  )
}

export default QuestionnairePage
