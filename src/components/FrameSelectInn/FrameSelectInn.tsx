import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Select } from 'antd'

import Div from 'components/Div' // TODO: from ui-lib
import EmptyResult from 'components/EmptyResult' // TODO: from ui-lib

import './FrameSelectInn.style.less'

const { Title } = Typography

export interface FrameSelectInnProps {

}

const FrameSelectInn: React.FC<FrameSelectInnProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <Div className="FrameSelectInn">
      <Title level={5}>{t('frameSteps.selectInn.title')}</Title>
      <Row>
        <Col lg={12} xl={10}>
          <Select
            showSearch
            notFoundContent={<EmptyResult />}
            placeholder={t('frameSteps.selectInn.placeholder')}
          >
          </Select>
        </Col>
      </Row>
    </Div>
  )
}

export default FrameSelectInn
