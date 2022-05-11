import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Button } from 'antd'
import type { ColumnsType } from 'antd/lib/table'

import { CompanyHead } from 'library/models'
import { renderBinaryCell } from 'library/helpers/table'

import './CompanyHeadsList.style.less'
import mockData from 'library/mock/heads' // TODO: integrate with API when ready

export interface CompanyHeadsListProps { }

const CompanyHeadsList: React.FC<CompanyHeadsListProps> = ({}) => {
  const { t } = useTranslation()
  const [ data, setData ] = useState<CompanyHead[]>()

  const columns: ColumnsType<CompanyHead> = [
    {
      key: 'fullName',
      dataIndex: 'fullName',
      title: t('headsPage.tableColumns.fullName'),
    },
    {
      key: 'isExecutive',
      dataIndex: 'isExecutive',
      title: t('headsPage.tableColumns.isExecutive'),
      render: renderBinaryCell,
      align: 'center',
    },
    {
      key: 'isAttorney',
      dataIndex: 'isAttorney',
      title: t('headsPage.tableColumns.isAttorney'),
      render: renderBinaryCell,
      align: 'center',
    },
    {
      key: 'ownership',
      dataIndex: 'ownership',
      title: t('headsPage.tableColumns.ownership'),
      align: 'center',
    },
  ]

  return (
    <div className="CompanyHeadsList" data-testid="CompanyHeadsList">
      <Table
        columns={columns}
        dataSource={mockData}
      />
    </div>
  )
}

export default CompanyHeadsList
