import { Spin } from 'antd'
import Div from 'orient-ui-library/components/Div'

import FrameClientWizard from 'components/FrameClientWizard'
import { useStoreState } from 'library/store'

import './FrameClientWizardPage.style.less'

const FrameClientWizardPage = () => {

  const companyId = useStoreState(state => state.company.companyId)

  if (!companyId) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <div className="FrameClientWizardPage" data-testid="FrameClientWizardPage">
      <FrameClientWizard companyId={companyId as number} />
    </div>
  )
}

export default FrameClientWizardPage
