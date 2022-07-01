import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, NavLink } from 'react-router-dom'

import { CompanyRequisitesDto } from 'orient-ui-library/library/models/document'

import { CheckCircleFilled, ClockCircleOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons'
import { Row, Timeline, Button, Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/lib/table'

import './CompanyDataReadyStatuses.style.less'

import { RETURN_URL_PARAM } from 'library/constants'
const { Item: TimelineItem } = Timeline

export interface CompanyDataReadyStatusesProps {
  companyDataStatus: Record<string, boolean | null>
  selectedBankRequisitesId?: number | null
  setSelectedBankRequisitesId?: (id: number | null) => void
  requisites?: CompanyRequisitesDto
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
  selectedBankRequisitesId,
  setSelectedBankRequisitesId,
  requisites,
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

  const renderSelectBankRequisitesModal = () => {
    if (!requisites) return 'There is no requisites here'

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
    // TODO: replace with plain requisites obj when array comes from BE
    const tableData: BankRequisitesTableData[] = [ requisites ]
      .map((r, i) => ({ ...r, key: i }))

    return (
      <Modal
        centered
        width={800}
        visible={bankRequisitesModalVisible}
        title={
          <Row gutter={16}>
            {t('frameSteps.documents.bankRequisites.title')}
            <NavLink to={`/bank-details/add?${RETURN_URL_PARAM}=${location.pathname}`}
                     className="OrderStepDocuments__companyDataStatus__link">
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
        <Table
          rowSelection={{
            type: 'radio',
            onChange: (_, selectedRows) => {
              setSelectedBankRequisitesId(selectedRows[0].id ?? null)
              console.log(selectedBankRequisitesId)
            },
          }}
          pagination={false}
          columns={columns}
          dataSource={tableData}
        />
      </Modal>
    )
  }

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
            <Button size="small"
                    type="link"
                    onClick={() => setBankRequisitesModalVisible(true)}
                    icon={<FormOutlined/>}
            >
              {t('common.actions.fill.title')}
            </Button>
            {renderSelectBankRequisitesModal()}

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
