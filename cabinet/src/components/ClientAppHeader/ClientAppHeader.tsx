import { useTranslation } from 'react-i18next'
import { NavLink, useHistory } from 'react-router-dom'
import { Button, Col, Modal, Row, Space, Spin, Typography } from 'antd'

import AppHeader from 'orient-ui-library/components/AppHeader' // TODO: from ui-lib
import { FACTORING_PATH, FRAME_ORDER_PATH, SIMPLE_FRAME_ORDER_PATH } from 'library/routes'
import { useStoreActions, useStoreState } from 'library/store'

import './ClientAppHeader.style.less'
import Icon, { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'

import { Div } from 'orient-ui-library/components'
import { BoxWithSmileSvg, HandshakeSvg } from 'components/ClientAppHeader/icons'
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'
import { getOrdersForFactoring } from 'library/api/orders'

const { Title, Paragraph, Text } = Typography

interface ClientAppHeaderProps {

}

interface ProductProps {
  key: string
  path: string
  title: string
  description: string
  ProductIcon: (props: Partial<CustomIconComponentProps>) => JSX.Element
  disabled: boolean
  showSpinner: boolean
}

const ClientAppHeader: React.FC<ClientAppHeaderProps> = ({}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { setLogout } = useStoreActions(actions => actions.user)
  const user = useStoreState(state => state.user.current)
  const company = useStoreState(state => state.company.current)

  const [ productsModalVisible, setProductsModalVisible ] = useState<boolean>(false)
  const [ factoringDisabled, setFactoringDisabled ] = useState<boolean>(false)
  const [ isCheckingInProcess, setIsCheckingInProcess ] = useState<boolean>(false)

  const handleLogout = () => {
    setLogout()
    history.push('/')
  }

  const products: ProductProps[] = [
    {
      key: 'frameOrder',
      path: FRAME_ORDER_PATH,
      title: t('productModal.frame.title'),
      description: t('productModal.frame.description'),
      ProductIcon: props => <Icon component={HandshakeSvg} {...props}/>,
      disabled: false,
      showSpinner: false,
    },
    {
      key: 'frameSimpleOrder',
      path: SIMPLE_FRAME_ORDER_PATH,
      title: t('productModal.frameSimple.title'),
      description: t('productModal.frameSimple.description'),
      ProductIcon: props => <Icon component={HandshakeSvg} {...props}/>,
      disabled: false,
      showSpinner: false,
    },
    {
      key: 'factoring',
      path: FACTORING_PATH,
      title: t('productModal.factoring.title'),
      description: t('productModal.factoring.description'),
      ProductIcon: props => <Icon component={BoxWithSmileSvg} {...props}/>,
      disabled: factoringDisabled,
      showSpinner: isCheckingInProcess,
    },
  ]

  const checkFactoringAvailability = async () => {
    setIsCheckingInProcess(true)
    const result = await getOrdersForFactoring(company!.id!)
    if (result.success) {
      const orders = result.data?.data ?? []
      setFactoringDisabled(orders.length === 0)
    }

    setIsCheckingInProcess(false)
  }

  const openModal = () => {
    if (company) {
      checkFactoringAvailability()
    }
    setProductsModalVisible(true)
  }

  const closeModal = () => {
    setProductsModalVisible(false)
  }

  const renderProduct = ({ path, title, description, ProductIcon, disabled, showSpinner }: ProductProps) => {
    let containerClasses = 'Product'
    if (disabled) {
      containerClasses += ' Product_disabled'
    }

    const productMarkup = (
      <Spin spinning={showSpinner}>
        <Div className={containerClasses} onClick={disabled ? undefined : closeModal}>
          <Title level={5}>{title}</Title>
          <Paragraph className="Product__description">{description}</Paragraph>
          <ProductIcon className="Product__icon"/>
        </Div>
      </Spin>
    )

    return disabled ? productMarkup : <NavLink to={path}>{productMarkup}</NavLink>
  }

  const renderProductsModal = () => (
    <Modal
      title={<Title
        level={4}
        style={{ textAlign: 'center' }}
      >
        {t('productModal.title')}
        <Text style={{ fontWeight: 'bold' }}>{company?.shortName}</Text>
      </Title>}
      visible={productsModalVisible}
      onCancel={closeModal}
      width={1300}
      footer={null}
    >
      <Row gutter={24}>
        {products.map(product => (
          <Col span={8} key={product.key}>{renderProduct(product)}</Col>
        ))}
      </Row>
    </Modal>
  )

  const renderMainAction = () => (
    <Button onClick={openModal}>
      <Space>
        {t('orders.actionButton.title')}
        <PlusOutlined/>
      </Space>
    </Button>
  )
  return (<>
    <AppHeader user={user} onLogout={handleLogout} mainAction={renderMainAction()}/>
    {renderProductsModal()}
  </>)
}

export default ClientAppHeader
