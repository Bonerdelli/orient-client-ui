import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Descriptions, Space, Row, Col, Card, Select, message } from 'antd'
import { BaseOptionType } from 'antd/es/select'

import Div from 'components/Div' // TODO: from ui-lib
import EmptyResult from 'components/EmptyResult' // TODO: from ui-lib

import { Customer } from 'library/models' // TODO: check API schema, why not from proxy?
import { searchCustomers } from 'library/api'

import './FrameSelectInn.style.less'

const { Title, Text } = Typography
const { Item: DescItem } = Descriptions

export interface FrameSelectInnProps {
  onNavigateNextAllow: (allow: boolean) => void
}

const FrameSelectInn: React.FC<FrameSelectInnProps> = ({ onNavigateNextAllow }) => {
  const { t } = useTranslation()

  const [ search, setSearch ] = useState<string>()
  const [ searching, setSearching ] = useState<boolean>(false)
  const [ foundItems, setFoundItems ] = useState<Customer[]>([])
  const [ options, setOptions ] = useState<BaseOptionType[]>()

  const [ selectedId, setSelectedId ] = useState<Customer['id']>()
  const [ selectedItem, setSelectedItem ] = useState<Customer>()

  useEffect(() => {
    if (foundItems) {
      setFoundItems([])
    }
    if (selectedItem) {
      setSelectedItem(undefined)
    }
    handleSearch()
  }, [search])

  useEffect(() => {
    const updatedResult = foundItems.map(datum => ({
      value: datum.id,
      label: (<Space>
        <Text>{datum.inn}</Text>
        <Text type="secondary">{datum.shortName}</Text>
      </Space>),
    }))
    setOptions(updatedResult)
  }, [foundItems])

  useEffect(() => {
    const item = foundItems.find(datum => datum.id === selectedId)
    setSelectedItem(item)
  }, [foundItems, selectedId])

  useEffect(() => {
    onNavigateNextAllow(true)
  }, [selectedItem])

  const handleSearch = async () => {
    setSearching(true)
    const result = await searchCustomers({ inn: search })
    if (result.success) {
      const items = result.data?.data ?? []
      setFoundItems(items as unknown as Customer[])
    } else {
      message.error(t('common.errors.dataLoadingError.title'))
    }
    setSearching(false)
  }


  const renderCustomerInfo = (customer: Customer) => (
    <Div className="FrameSelectInn__customerInfo">
      <Title level={5}>{t('frameSteps.selectInn.customerInfo.title')}</Title>
      <Card>
        <Descriptions title={customer.shortName}>
          <DescItem label={t('models.customer.fields.shortName.title')}>{customer.shortName}</DescItem>
          <DescItem label={t('models.customer.fields.chief.title')}>{customer.chief}</DescItem>
          <DescItem label={t('models.customer.fields.soato.title')}>{customer.soato}</DescItem>
          <DescItem label={t('models.customer.fields.address.title')}>{customer.address}</DescItem>
        </Descriptions>
      </Card>
    </Div>
  )

  return (
    <Div className="FrameSelectInn">
      <Title level={5}>{t('frameSteps.selectInn.title')}</Title>
      <Row>
        <Col lg={12} xl={10}>
          <Select
            className="FrameSelectInn__select"
            onSearch={setSearch}
            loading={searching}
            notFoundContent={search && <EmptyResult />}
            onSelect={setSelectedId}
            options={options}
          >
          </Select>
        </Col>
        {selectedItem && renderCustomerInfo(selectedItem)}
      </Row>
    </Div>
  )
}

// TODO: add live search (ask BE for partial search by inn)
// <Select
//   showSearch
//   placeholder={t('frameSteps.selectInn.placeholder')}

export default FrameSelectInn
