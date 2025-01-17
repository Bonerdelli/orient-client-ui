import { Spin } from 'antd'
import Div from 'orient-ui-library/components/Div'

import FrameSimpleClientWizard from 'components/FrameSimpleClientWizard'
import { useStoreState } from 'library/store'

import './FrameSimpleClientWizardPage.style.less'

const FrameSimpleClientWizardPage = () => {

  const companyId = useStoreState(state => state.company.companyId)

  if (!companyId) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <div className="FrameSimpleClientWizardPage" data-testid="FrameSimpleClientWizardPage">
      <FrameSimpleClientWizard companyId={companyId as number} />
    </div>
  )
}

export default FrameSimpleClientWizardPage
