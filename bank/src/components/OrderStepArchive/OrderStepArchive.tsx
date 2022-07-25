import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { sortBy } from 'lodash'

import { Typography, Skeleton, Spin } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

import OrderDocumentsList from 'components/OrderDocumentsList'

import { getFrameWizardStep } from 'library/api/frameWizard'

import './OrderStepArchive.style.less'

const { Title } = Typography

export interface OrderDocumentsProps {
  wizardType?: FrameWizardType
  bankId?: number | bigint
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepArchive: React.FC<OrderDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  bankId,
  orderId,
  currentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate models
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])

  useEffect(() => {
    loadStepData()
  }, [currentStep])

  useEffect(() => {
    if (!stepData) return
    const currentDocuments = stepData?.documents ?? []
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []

    sortBy(currentDocuments, 'priority')
      .filter((doc: OrderDocument) => Boolean(doc.info))
      .forEach((doc: OrderDocument) => {
        updatedDocumentTypes.push(doc.typeId)
        updatedDocuments.push(doc)
      })

    setDocuments(updatedDocuments)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentsLoading(false)
  }, [stepData ])

  const loadStepData = async () => {
    if (documentTypes === null) {
      // NOTE: do not show loader every time updates
      setDocumentsLoading(true)
    }
    const result = await getFrameWizardStep({
      type: wizardType,
      step: sequenceStepNumber,
      bankId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<any>).data) // TODO: ask be to generate models
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  // NOTE: not used yet, for the future
  /* const checkSignedFn = (document: OrderDocument) => {
    if (!document.info) {
      return false
    }
    const {
      needClientSign,
      needBankSign,
      needCustomerSign,
      clientSigned,
      bankSigned,
      customerSigned,
    } = document.info
    const statusClient = needClientSign ? Boolean(clientSigned) : true
    const statusBank = needBankSign ? Boolean(bankSigned) : true
    const statusCustomer = needCustomerSign ? Boolean(customerSigned) : true
    return statusClient && statusBank && statusCustomer
  } */

  const renderDocuments = () =>  (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        types={documentTypes || []}
        current={documents}
      />
    </Spin>
  )

  const renderStepContent = () => (
    <Div className="OrderStepArchive">
      <Div className="WizardStep__section">
        <Title level={5}>{t('orderStepArchive.docsSectionTitle')}</Title>
        {renderDocuments()}
      </Div>
    </Div>
  )

  if (!stepData && stepDataLoading) {
    return (
      <Skeleton active={true}/>
    )
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning"/>
    )
  }

  return (
    <Div className="WizardStep__content">
      {renderStepContent()}
    </Div>
  )
}
export default OrderStepArchive
