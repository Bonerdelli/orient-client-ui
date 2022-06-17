import { Layout } from 'antd'

import DocumentsList from 'components/DocumentsList'

import './DocumentsPage.style.less'

// TODO: FIXME look in db, there is no augmentable types
const DOC_TYPES_TO_SHOW = Array.from({ length: 8 }, (_, i) => i + 1)

const DocumentsPage = () => {
  return (
    <Layout className="DocumentsPage" data-testid="DocumentsPage">
      <DocumentsList showHeader types={DOC_TYPES_TO_SHOW} />
    </Layout>
  )
}

export default DocumentsPage
