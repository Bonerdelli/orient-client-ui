import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './FormSelectInput.style.less'

const { Paragraph } = Typography

export interface FormSelectInputProps {

}

const FormSelectInput: React.FC<FormSelectInputProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="FormSelectInput" data-testid="FormSelectInput">
      <Paragraph>{t('FormSelectInput.component')}</Paragraph>
    </div>
  )
}

export default FormSelectInput
