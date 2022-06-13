import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'components/Div'

import './FrameBankOffers.style.less'

const { Title } = Typography

export interface FrameBankOffersProps {

}

const FrameBankOffers: React.FC<FrameBankOffersProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <Div className="FrameBankOffers">
      <Title level={5}>{t('frameSteps.bankOffers.bankList.title')}</Title>
    </Div>
  )
}

export default FrameBankOffers
