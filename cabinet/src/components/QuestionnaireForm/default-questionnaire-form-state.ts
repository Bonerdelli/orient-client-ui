import {QuestionnaireFormData} from './questionnaire-form.interface';
import {
  AverageEmployeesCountIdEnum,
  TaxationSystemIdEnum,
} from 'components/QuestionnaireForm/QuestionnaireGeneralInfoFormFields';

export const defaultQuestionnaireFormState: QuestionnaireFormData = {
  averageEmployeesCountId: AverageEmployeesCountIdEnum.LessThan100,
  taxationSystemId: TaxationSystemIdEnum.Common,
  paymentFormId: 0, // Replace with enum
  belongsToHoldings: false,
  holdingName: '',
  headCompanyName: '',
  headCompanyInn: '',
  hasCredits: false,
  credits: [],
  creditExpirations: [],
  hasTrials: false,
  trials: [],
  suppliers: [],
  buyers: [],
  hasEasyFinansIndividuals: false,
  easyFinanceIndividuals: [],
  hasEasyFinansLegals: false,
  easyFinanceLegals: []
}
