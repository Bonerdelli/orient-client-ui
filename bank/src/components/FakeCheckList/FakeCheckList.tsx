import { Row, Col, Typography, List, Checkbox } from 'antd'

import './FakeCheckList.style.less'

const { Text } = Typography

export interface FakeCheckListProps {
  defaultChecked?: boolean
}

const checkListData = [
  'Параметр 1',
  'Параметр 2',
  'Параметр 3',
];

const FakeCheckList: React.FC<FakeCheckListProps> = ({ defaultChecked }) => {
  return (
    <Row>
      <Col lg={12}>
        <List
          bordered
          dataSource={checkListData}
          renderItem={item => (
            <List.Item>
              <Checkbox defaultChecked={defaultChecked ?? false}><Text>{item}</Text></Checkbox>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}

export default FakeCheckList
