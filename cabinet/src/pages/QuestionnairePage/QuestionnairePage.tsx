import { Button, Card, Layout, Skeleton, Spin, Typography } from 'antd'
import { useStoreState } from 'library/store'
import './QuestionnairePage.style.less'
import { Div } from 'orient-ui-library/components'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { RETURN_URL_PARAM } from 'library/constants'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { CompanyQuestionnaireDto } from 'orient-ui-library/library/models/proxy'
import { getQuestionnaire, sendQuestionnaire } from 'library/api/questionnaire'
import QuestionnaireForm from 'orient-ui-library/components/QuestionnaireForm'

const { Title } = Typography

const QuestionnairePage = () => {
  const { t } = useTranslation()
  const { search } = useLocation()
  const returnUrl = new URLSearchParams(search).get(RETURN_URL_PARAM)

  const companyId = useStoreState(state => state.company.companyId)
  const dictionaries = useStoreState(state => state.dictionary.list)

  const [ isQuestionnaireLoading, setIsQuestionnaireLoading ] = useState<boolean>(true)
  const [ questionnaireDto, setQuestionnaireDto ] = useState<CompanyQuestionnaireDto | null>(null)

  useEffect(() => {
    if (companyId) {
      fetchQuestionnaire()
    }
  }, [ companyId ])

  const fetchQuestionnaire = async () => {
    const result = await getQuestionnaire(companyId!)
    if (result.success) {
      setQuestionnaireDto(result.data as CompanyQuestionnaireDto)
    }
    setIsQuestionnaireLoading(false)
  }

  const onSave = async (dto: CompanyQuestionnaireDto) => {
    await sendQuestionnaire(companyId!, dto)
  }

  if (!companyId) {
    return <Div className="AppLayout__loaderWrap">
      <Spin size="large"/>
    </Div>
  }

  if (isQuestionnaireLoading || !dictionaries) {
    return (
      <Skeleton active/>
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

        <QuestionnaireForm questionnaireDto={questionnaireDto}
                           dictionaries={dictionaries}
                           isEditable={true}
                           onSave={onSave}
                           returnUrl={returnUrl}/>
      </Card>
    </Layout>
  )
}

export default QuestionnairePage
