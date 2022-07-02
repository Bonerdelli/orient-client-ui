import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

import Div from 'orient-ui-library/components/Div'

import { CheckCircleFilled, ClockCircleOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons'
import { Button, Modal, Row, Skeleton, Table, Timeline } from 'antd'
import type { ColumnsType } from 'antd/lib/table'

import './CompanyDataReadyStatuses.style.less'

import { RETURN_URL_PARAM } from 'library/constants'
import { CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'
import { getCompanyRequisitesList } from 'library/api'

const { Item: TimelineItem } = Timeline

export interface CompanyDataReadyStatusesProps {
  companyDataStatus: Record<string, boolean | null>
  setSelectedBankRequisites?: (requisites: CompanyRequisitesDto) => void
  selectedRequisites?: CompanyRequisitesDto | null
  founderId?: number
  companyId?: number
}

interface BankRequisitesTableData extends CompanyRequisitesDto {
  key: number
}

export const companyDataInitialStatus: Record<string, boolean | null> = {
  companyHead: null,
  bankRequisites: null,
  questionnaire: null,
}

const CompanyDataReadyStatuses: React.FC<CompanyDataReadyStatusesProps> = ({
  companyDataStatus,
  setSelectedBankRequisites,
  selectedRequisites,
  founderId,
  companyId,
}) => {
  const { t } = useTranslation()
  const location = useLocation()

  const [ bankRequisitesModalVisible, setBankRequisitesModalVisible ] = useState<boolean>(false)
  const [ requisitesList, setRequisitesList ] = useState<CompanyRequisitesDto[]>([])
  const [ companyRequisitesLoading, setCompanyRequisitesLoading ] = useState<boolean>(false)

  const dotParams = (ready: boolean | null) => ({
    dot: ready === true
      ? <CheckCircleFilled className="CompanyDataReadyStatuses__item__okIcon"/>
      : (ready === null ? <ClockCircleOutlined/> : <ExclamationCircleOutlined/>),
    color: ready === true ? 'green'
      : (ready === null ? 'grey' : 'red'),
  })

  const renderSelectBankRequisitesModal = () => {
    const columns: ColumnsType<BankRequisitesTableData> = [
      {
        title: t('frameSteps.documents.bankRequisites.bankName'),
        dataIndex: 'bankName',
      },
      {
        title: t('frameSteps.documents.bankRequisites.mfo'),
        dataIndex: 'mfo',
      },
      {
        title: t('frameSteps.documents.bankRequisites.accountNumber'),
        dataIndex: 'accountNumber',
      },
    ]

    return (
      <Modal
        centered
        width={800}
        visible={bankRequisitesModalVisible}
        title={
          <Row gutter={16}>
            {t('frameSteps.documents.bankRequisites.title')}
            <NavLink to={`/bank-details/add?${RETURN_URL_PARAM}=${location.pathname}`}
                     className="CompanyDataReadyStatuses__item__link">
              <Button size="small" type="link" icon={<FormOutlined/>}>
                {t('frameSteps.documents.bankRequisites.add')}
              </Button>
            </NavLink>
          </Row>
        }
        onCancel={() => setBankRequisitesModalVisible(false)}
        footer={
          <Button type="primary"
                  onClick={() => setBankRequisitesModalVisible(false)}>
            {t('frameSteps.documents.bankRequisites.save')}
          </Button>
        }
      >
        {companyRequisitesLoading && <Skeleton active/>}
        {!companyRequisitesLoading &&
          <Table
            rowSelection={{
              type: 'radio',
              onChange: (_, selectedRows) => {
                setSelectedBankRequisites?.(selectedRows[0] ?? null)
              },
              selectedRowKeys: selectedRequisites ? [ selectedRequisites.id! ] : [],
            }}
            pagination={false}
            columns={columns}
            dataSource={requisitesList}
          />
        }
      </Modal>
    )
  }

  const openRequisitesModal = async () => {
    setBankRequisitesModalVisible(true)
    setCompanyRequisitesLoading(true)
    const res = await getCompanyRequisitesList({ companyId: companyId! })
    if (res.success) {
      setRequisitesList(res.data?.map(requisites => ({ ...requisites, key: requisites.id! })) ?? [])
    }
    setCompanyRequisitesLoading(false)
  }

  return (
    <Timeline className="CompanyDataReadyStatuses__item">
      <TimelineItem {...dotParams(companyDataStatus?.companyHead ?? null)}>
        {t('frameSteps.documents.companyData.companyHead')}
        <NavLink to={`/company-heads/${founderId}?${RETURN_URL_PARAM}=${location.pathname}`}
                 className="CompanyDataReadyStatuses__item__link">
          <Button size="small" type="link" icon={<FormOutlined/>}>
            {t(`frameSteps.documents.fillDataButton.${companyDataStatus?.companyHead ? 'check' : 'fill'}`)}
          </Button>
        </NavLink>
      </TimelineItem>
      <TimelineItem {...dotParams(companyDataStatus?.bankRequisites ?? null)}>
        {t('frameSteps.documents.companyData.bankRequisites')}
        {selectedRequisites && <Div className="CompanyDataReadyStatuses__item__link">
          <Button size="small"
                  type="link"
                  onClick={openRequisitesModal}
                  icon={<FormOutlined/>}
          >
            {t(`frameSteps.documents.fillDataButton.${companyDataStatus?.bankRequisites ? 'choose' : 'fill'}`)}
          </Button>
        </Div>}
        {renderSelectBankRequisitesModal()}
      </TimelineItem>
      <TimelineItem {...dotParams(companyDataStatus?.questionnaire ?? null)}>
        {t('frameSteps.documents.companyData.questionnaire')}
        <NavLink to={`/questionnaire?${RETURN_URL_PARAM}=${location.pathname}`}
                 className="CompanyDataReadyStatuses__item__link">
          <Button size="small" type="link" icon={<FormOutlined/>}>
            {t(`common.actions.${companyDataStatus?.questionnaire ? 'check' : 'fill'}.title`)}
          </Button>
        </NavLink>
      </TimelineItem>
    </Timeline>
  )
}

export default CompanyDataReadyStatuses
