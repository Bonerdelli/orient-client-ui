import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography, Skeleton, Spin, Row, Col, Button } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { WizardStepResponse } from 'orient-ui-library/library/models/wizard'

import OrderDocumentsList from 'components/OrderDocumentsList'

import { getFrameWizardStep } from 'library/api/frameWizard'

import './OrderStepArchive.style.less'

const { Title } = Typography

export interface OrderDocumentsProps {
 bankId?: number | bigint
 orderId?: number
 currentStep: number
 sequenceStepNumber: number
 setCurrentStep: (step: number) => void
}

const OrderStepArchive: React.FC<OrderDocumentsProps> = ({
 bankId,
 orderId,
 currentStep,
 sequenceStepNumber,
 setCurrentStep,
}) => {
 const { t } = useTranslation()

 const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

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

   currentDocuments
     .filter((doc: OrderDocument) => Boolean(doc.info))
     .forEach((doc: OrderDocument) => {
       updatedDocumentTypes.push(doc.typeId)
       updatedDocuments.push(doc)
     })

   setDocuments(updatedDocuments)
   setDocumentTypes(updatedDocumentTypes)
   setDocumentsLoading(false)
 }, [stepData])

 const loadStepData = async () => {
   if (documentTypes === null) {
     // NOTE: do not show loader every time updates
     setDocumentsLoading(true)
   }
   const result = await getFrameWizardStep({
     step: sequenceStepNumber,
     bankId,
     orderId,
   })
   if (result.success) {
     setStepData((result.data as WizardStepResponse<any>).data) // TODO: ask be to generate models
     setDataLoaded(true)
   } else {
     setDataLoaded(false)
   }
   setStepDataLoading(false)
 }

 const handlePrevStep = () => {
   if (isPrevStepAllowed) {
     setCurrentStep(sequenceStepNumber - 1)
   }
 }

 const renderPrevStepButton = () => {
   // NOTE: disabled as we can't go back by status model
   return (
     <Button
       size="large"
       type="primary"
       onClick={handlePrevStep}
       disabled={!isPrevStepAllowed}
     >
       {t('common.actions.back.title')}
     </Button>
   )
 }

 const renderActions = () => (
   <Row className="WizardStep__actions">
     <Col>{renderPrevStepButton()}</Col>
     <Col flex={1}></Col>
   </Row>
 )

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
     <Skeleton active={true} />
   )
 }

 if (dataLoaded === false) {
   return (
     <ErrorResultView centered status="warning" />
   )
 }

 return (
   <Div className="WizardStep__content">
     {renderStepContent()}
     {renderActions()}
   </Div>
 )
}

export default OrderStepArchive
