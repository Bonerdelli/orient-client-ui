import { useTranslation } from 'react-i18next'

import { Input } from 'antd'
import { InputProps } from 'antd/es/input'

// import { formatNumber } from 'orient-ui-library/library/helpers'

interface NumericInputProps extends InputProps {
  value: string
  onChange: (value: string) => void
  integer?: boolean
}

// TODO: add support for integer numbers (change regex and parser)

const NumericInput: React.FC<NumericInputProps> = (props) => {
  const { value, onChange } = props
  const { t } = useTranslation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    const reg = /^-?\d*(\.\d*)?$/ // TODO: move to constants?
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      onChange(inputValue)
    }
  }

  const handleBlur = () => {
    // Replace '.' at the end or only '-' in the input box
    let enteredValue = value
    if (value?.charAt(value.length - 1) === '.' || value === '-') {
      enteredValue = value.slice(0, -1)
    }
    onChange(enteredValue.replace(/0*(\d+)/, '$1'))
  }

  return (
    <Input
      {...props}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={t('common.forms.numericInput.placeholder')}
      maxLength={25}
    />
  )
}

export default NumericInput
