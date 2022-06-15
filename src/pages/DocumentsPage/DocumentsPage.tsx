import { Layout } from 'antd'
import { range } from 'lodash'

import CompanyDocumentsList from 'components/CompanyDocumentsList'

import './DocumentsPage.style.less'

// NOTE: show documents with types 1..8
// TODO: FIXME look in db, there is no augmentable types
const DOC_TYPES_TO_SHOW = range(1, 8)

const DocumentsPage = () => {
  return (
    <Layout className="DocumentsPage" data-testid="DocumentsPage">
      <CompanyDocumentsList types={DOC_TYPES_TO_SHOW} />
    </Layout>
  )
}

export default DocumentsPage
