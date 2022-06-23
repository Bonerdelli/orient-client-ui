import { Spin, Layout } from 'antd'
import { range } from 'lodash'

import Div from 'orient-ui-library/components/Div'

import { useStoreState } from 'library/store'
import CompanyDocumentsList from 'components/CompanyDocumentsList'

import './DocumentsPage.style.less'

// NOTE: show documents with types 1..8
// TODO: FIXME look in db, there is no augmentable types
const DOC_TYPES_TO_SHOW = range(1, 8)

const DocumentsPage = () => {
  const company = useStoreState(state => state.company.current)
  const companyId = company?.id as number
  if (!companyId) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }
  return (
    <Layout className="DocumentsPage" data-testid="DocumentsPage">
      <CompanyDocumentsList companyId={companyId} types={DOC_TYPES_TO_SHOW} />
    </Layout>
  )
}

export default DocumentsPage
