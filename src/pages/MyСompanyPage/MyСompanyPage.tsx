import { useTranslation } from 'react-i18next'

import CompanyForm from 'components/CompanyForm'

import './MyСompanyPage.style.less'

const MyСompanyPage = () => {
  const { t } = useTranslation()
  return (
    <div className="MyСompanyPage" data-testid="MyСompanyPage">
      <CompanyForm />
    </div>
  )
}

export default MyСompanyPage
