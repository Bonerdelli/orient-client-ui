import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Tag, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'

import './CompanyHeadsList.style.less'

interface CompanyHead {
  fullName: string
  isExecutive: boolean
  isAttorney: boolean
  ownership: boolean
}

export interface CompanyHeadsListProps {

}

const CompanyHeadsList: React.FC<CompanyHeadsListProps> = ({}) => {
  const { t } = useTranslation()
  const [ data, setData ] = useState<CompanyHead[]>()

  const columns: ColumnsType<CompanyHead> = [
    {
      title: t('headsPage.tableColumns.fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: t('headsPage.tableColumns.isExecutive'),
      dataIndex: 'isExecutive',
      key: 'isExecutive',
    },
    {
      title: t('headsPage.tableColumns.isAttorney'),
      dataIndex: 'isAttorney',
      key: 'isAttorney',
    },
    {
      title: t('headsPage.tableColumns.ownership'),
      dataIndex: 'ownership',
      key: 'ownership',
    },
  ]

  return (
    <div className="CompanyHeadsList" data-testid="CompanyHeadsList">
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default CompanyHeadsList
