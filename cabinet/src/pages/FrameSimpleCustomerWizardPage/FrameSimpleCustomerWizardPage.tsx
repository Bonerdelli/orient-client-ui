import { Spin } from 'antd'
import Div from 'orient-ui-library/components/Div'

import FrameSimpleCustomerWizard from 'components/FrameSimpleCustomerWizard'
import { useStoreState } from 'library/store'

import './FrameSimpleCustomerWizardPage.style.less'

const FrameSimpleCustomerWizardPage = () => {

  const companyId = useStoreState(state => state.company.companyId)

  if (!companyId) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <div className="FrameSimpleCustomerWizardPage" data-testid="FrameSimpleCustomerWizardPage">
      <FrameSimpleCustomerWizard companyId={companyId as number} />
    </div>
  )
}

export default FrameSimpleCustomerWizardPage
