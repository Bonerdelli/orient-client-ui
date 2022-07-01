import { useTranslation } from 'react-i18next'
import { useLocation, NavLink } from 'react-router-dom'

import { CheckCircleFilled, ClockCircleOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons'
import { Timeline, Button } from 'antd'

import './CompanyDataReadyStatuses.style.less'

import { RETURN_URL_PARAM } from 'library/constants'
const { Item: TimelineItem } = Timeline

export interface CompanyDataReadyStatusesProps {
  сompanyDataStatus: Record<string, boolean | null>
}

export const сompanyDataInitialStatus: Record<string, boolean | null> = {
  сompanyHead: null,
  bankRequisites: null,
  questionnaire: null,
}

const CompanyDataReadyStatuses: React.FC<CompanyDataReadyStatusesProps> = ({ сompanyDataStatus }) => {
  const { t } = useTranslation()
  const location = useLocation()

  const dotParams = (ready: boolean | null) => ({
    dot: ready === true
      ? <CheckCircleFilled className="OrderStepDocuments__companyDataStatus__okIcon"/>
      : (ready === null ? <ClockCircleOutlined/> : <ExclamationCircleOutlined/>),
    color: ready === true ? 'green'
      : (ready === null ? 'grey' : 'red'),
  })
  return (
    <Timeline className="OrderStepDocuments__companyDataStatus">
      <TimelineItem {...dotParams(сompanyDataStatus?.сompanyHead ?? null)}>
        {t('frameSteps.documents.сompanyData.сompanyHead')}
        {!сompanyDataStatus?.сompanyHead && (
          <NavLink to="/my-company" className="OrderStepDocuments__companyDataStatus__link">
            <Button size="small" type="link" icon={<FormOutlined/>}>
              {t('common.actions.fill.title')}
            </Button>
          </NavLink>
        )}
      </TimelineItem>
      <TimelineItem {...dotParams(сompanyDataStatus?.bankRequisites ?? null)}>
        {t('frameSteps.documents.сompanyData.bankRequisites')}
        {!сompanyDataStatus?.bankRequisites && (
          <NavLink to="/my-company" className="OrderStepDocuments__companyDataStatus__link">
            <Button size="small" type="link" icon={<FormOutlined/>}>
              {t('common.actions.fill.title')}
            </Button>
          </NavLink>
        )}
      </TimelineItem>
      <TimelineItem {...dotParams(сompanyDataStatus?.questionnaire ?? null)}>
        {t('frameSteps.documents.сompanyData.questionnaire')}
        <NavLink to={`/questionnaire?${RETURN_URL_PARAM}=${location.pathname}`}
                 className="OrderStepDocuments__companyDataStatus__link">
          <Button size="small" type="link" icon={<FormOutlined/>}>
            {t(`common.actions.${сompanyDataStatus?.questionnaire ? 'check' : 'fill'}.title`)}
          </Button>
        </NavLink>
      </TimelineItem>
    </Timeline>
  )
}

export default CompanyDataReadyStatuses
