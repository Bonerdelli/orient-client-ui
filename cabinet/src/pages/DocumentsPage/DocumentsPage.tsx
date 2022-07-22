import { Spin, Layout } from 'antd'

import Div from 'orient-ui-library/components/Div'

import { useStoreState } from 'library/store'
import CompanyDocumentsList from 'components/CompanyDocumentsList'

import './DocumentsPage.style.less'

const DocumentsPage = () => {
  const companyId = useStoreState(state => state.company.companyId)
  if (!companyId) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }
  return (
    <Layout className="DocumentsPage" data-testid="DocumentsPage">
      <CompanyDocumentsList companyId={companyId} />
    </Layout>
  )
}

export default DocumentsPage
