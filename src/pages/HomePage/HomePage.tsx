import { useTranslation } from 'react-i18next'

import './HomePage.style.less'

const HomePage = () => {
  const { t } = useTranslation()
  return (
    <div className="HomePage" data-testid="HomePage">
      <h1>{t('Hello, I\'m a web application')}</h1>
    </div>
  )
}

export default HomePage
