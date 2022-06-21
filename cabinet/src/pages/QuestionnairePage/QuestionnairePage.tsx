import {Card, Layout, Spin} from 'antd';
import {useStoreState} from 'library/store';
import './QuestionnairePage.style.less';
import {Div} from 'orient-ui-library/components';
import QuestionnaireForm from 'components/QuestionnaireForm';
import {useTranslation} from 'react-i18next';

const QuestionnairePage = () => {
  const {t} = useTranslation();
  const company = useStoreState(state => state.company.current);

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large"/>
      </Div>
    );
  }

  return (
    <Layout className="QuestionnairePage">
      <Card title={t('sections.questionnaire.title')}>
        <QuestionnaireForm companyId={String(company.id)}/>
      </Card>
    </Layout>
  );
};

export default QuestionnairePage;
