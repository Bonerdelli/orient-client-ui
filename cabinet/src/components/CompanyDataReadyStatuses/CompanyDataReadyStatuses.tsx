import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

import { CheckCircleFilled, ClockCircleOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons'
import { Button, Modal, Row, Table, Timeline } from 'antd'
import type { ColumnsType } from 'antd/lib/table'

import Div from 'orient-ui-library/components/Div'
import { CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

import './CompanyDataReadyStatuses.style.less'

import { RETURN_URL_PARAM } from 'library/constants'
import { Key } from 'antd/lib/table/interface'
import { isUndefined } from 'lodash'

const { Item: TimelineItem } = Timeline

export interface CompanyDataReadyStatusesProps {
  wizardType?: FrameWizardType
  companyDataStatus: Record<string, boolean | null>
  selectedRequisitesId?: number
  onSaveRequisites?: (requisites: CompanyRequisitesDto) => void
  founderId?: number
  requisitesList: BankRequisitesTableData[]
}

export interface BankRequisitesTableData extends CompanyRequisitesDto {
  key: number
}

export const companyDataInitialStatus: Record<string, boolean | null> = {
  companyHead: null,
  bankRequisites: null,
  questionnaire: null,
}

const CompanyDataReadyStatuses: React.FC<CompanyDataReadyStatusesProps> = ({
  wizardType = FrameWizardType.Full,
  companyDataStatus,
  selectedRequisitesId,
  onSaveRequisites,
  founderId,
  requisitesList,
}) => {
  const { t } = useTranslation()
  const location = useLocation()

  const [ bankRequisitesModalVisible, setBankRequisitesModalVisible ] = useState<boolean>(false)
  const [ selectedRowKeys, setSelectedRowKeys ] = useState<Key[]>([])

  useEffect(() => {
    if (requisitesList.length === 1) {
      setSelectedRowKeys([ requisitesList[0].id! ])
    }

    if (requisitesList.length > 1 && !isUndefined(selectedRequisitesId)) {
      setSelectedRowKeys([ selectedRequisitesId ])
    }
  }, [ requisitesList ])

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
    const handleSaveBankRequisites = () => {
      const selectedReqId = selectedRowKeys[0]
      const requisites = requisitesList?.find(({ id }) => id === selectedReqId)
      if (requisites) {
        const { key, ...rest } = requisites
        onSaveRequisites?.(rest)
      }
      setBankRequisitesModalVisible(false)
    }

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
                  onClick={handleSaveBankRequisites}>
            {t('frameSteps.documents.bankRequisites.save')}
          </Button>
        }
      >
        <Table
          rowSelection={{
            type: 'radio',
            onChange: (keys) => {
              setSelectedRowKeys(keys)
            },
            selectedRowKeys,
          }}
          onRow={item => ({
            onClick: () => {
              if (item.key && !selectedRowKeys.includes(item.key)) {
                setSelectedRowKeys([
                  item.key,
                ])
              }
            }
          })}
          pagination={false}
          columns={columns}
          dataSource={requisitesList}
          rowKey="id"
        />
      </Modal>
    )
  }

  const openRequisitesModal = async () => {
    setBankRequisitesModalVisible(true)
  }

  const renderQuestionnaire = () => (
    <TimelineItem {...dotParams(companyDataStatus?.questionnaire ?? null)}>
      {t('frameSteps.documents.companyData.questionnaire')}
      <NavLink to={`/questionnaire?${RETURN_URL_PARAM}=${location.pathname}`}
               className="CompanyDataReadyStatuses__item__link">
        <Button size="small" type="link" icon={<FormOutlined/>}>
          {t(`common.actions.${companyDataStatus?.questionnaire ? 'check' : 'fill'}.title`)}
        </Button>
      </NavLink>
    </TimelineItem>
  )

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
        <Div className="CompanyDataReadyStatuses__item__link">
          <Button size="small"
                  type="link"
                  onClick={openRequisitesModal}
                  icon={<FormOutlined/>}
          >
            {t(`frameSteps.documents.fillDataButton.${requisitesList?.length === 0 ? 'fill' : 'choose'}`)}
          </Button>
        </Div>
        {renderSelectBankRequisitesModal()}
      </TimelineItem>
      {wizardType === FrameWizardType.Full && renderQuestionnaire()}
    </Timeline>
  )
}

export default CompanyDataReadyStatuses
