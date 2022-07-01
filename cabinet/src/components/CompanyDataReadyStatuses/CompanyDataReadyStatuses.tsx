import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, NavLink } from 'react-router-dom'

import { CheckCircleFilled, ClockCircleOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons'
import { Timeline, Button } from 'antd'

import './CompanyDataReadyStatuses.style.less'

import { RETURN_URL_PARAM } from 'library/constants'
const { Item: TimelineItem } = Timeline

export interface CompanyDataReadyStatusesProps {
  companyDataStatus: Record<string, boolean | null>
  selectedBankRequisitesId?: number | null
  setSelectedBankRequisitesId? (id: number | null) => void
}

export const companyDataInitialStatus: Record<string, boolean | null> = {
  companyHead: null,
  bankRequisites: null,
  questionnaire: null,
}

const CompanyDataReadyStatuses: React.FC<CompanyDataReadyStatusesProps> = ({
  companyDataStatus
  selectedBankRequisitesId,
  setSelectedBankRequisitesId,
}) => {
  const { t } = useTranslation()
  const location = useLocation()

  const [ bankRequisitesModalVisible, setBankRequisitesModalVisible ] = useState<boolean>(false)


  const dotParams = (ready: boolean | null) => ({
    dot: ready === true
      ? <CheckCircleFilled className="OrderStepDocuments__companyDataStatus__okIcon"/>
      : (ready === null ? <ClockCircleOutlined/> : <ExclamationCircleOutlined/>),
    color: ready === true ? 'green'
      : (ready === null ? 'grey' : 'red'),
  })
  return (
    <Timeline className="OrderStepDocuments__companyDataStatus">
      <TimelineItem {...dotParams(companyDataStatus?.companyHead ?? null)}>
        {t('frameSteps.documents.companyData.companyHead')}
        {!companyDataStatus?.companyHead && (
          <NavLink to="/my-company" className="OrderStepDocuments__companyDataStatus__link">
            <Button size="small" type="link" icon={<FormOutlined/>}>
              {t('common.actions.fill.title')}
            </Button>
          </NavLink>
        )}
      </TimelineItem>
      <TimelineItem {...dotParams(companyDataStatus?.bankRequisites ?? null)}>
        {t('frameSteps.documents.companyData.bankRequisites')}
        {!companyDataStatus?.bankRequisites && (
          <NavLink to="/my-company" className="OrderStepDocuments__companyDataStatus__link">
            <Button size="small" type="link" icon={<FormOutlined/>}>
              {t('common.actions.fill.title')}
            </Button>
          </NavLink>
        )}
      </TimelineItem>
      <TimelineItem {...dotParams(companyDataStatus?.questionnaire ?? null)}>
        {t('frameSteps.documents.companyData.questionnaire')}
        <NavLink to={`/questionnaire?${RETURN_URL_PARAM}=${location.pathname}`}
                 className="OrderStepDocuments__companyDataStatus__link">
          <Button size="small" type="link" icon={<FormOutlined/>}>
            {t(`common.actions.${companyDataStatus?.questionnaire ? 'check' : 'fill'}.title`)}
          </Button>
        </NavLink>
      </TimelineItem>
    </Timeline>
  )
}

export default CompanyDataReadyStatuses
