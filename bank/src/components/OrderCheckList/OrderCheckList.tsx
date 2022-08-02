import { Checkbox, Col, List, Row, Typography } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { OrderCheckList } from 'library/models'

import './OrderCheckList.style.less'

const { Text } = Typography

export interface OrderCheckListProps {
  checkList?: OrderCheckList[]
  onChange?: (checkList: OrderCheckList[]) => void
  readonlyMode?: boolean
}

const OrderCheckList: React.FC<OrderCheckListProps> = ({
  checkList,
  onChange,
  readonlyMode = false,
}) => {
  const handleChange = (value: CheckboxChangeEvent, item: OrderCheckList) => {
    item.isChecked = value.target.checked
    onChange && onChange(checkList ?? [])
  }
  return (
    <Row>
      <Col lg={12}>
        <List
          bordered
          dataSource={checkList}
          renderItem={item => (
            <List.Item>
              <Checkbox
                defaultChecked={item.isChecked ?? false}
                onChange={(value) => handleChange(value, item)}
                disabled={readonlyMode}
              >
                <Text>{item.checkListCode}</Text>
              </Checkbox>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}

export default OrderCheckList
