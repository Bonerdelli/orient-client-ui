import {QuestionnaireFormCredit, QuestionnaireFormData} from './questionnaire-form.interface';
import {
  AverageEmployeesCountIdEnum,
  TaxationSystemIdEnum,
} from 'components/QuestionnaireForm/QuestionnaireGeneralInfoFormFields';

export const emptyCredit: QuestionnaireFormCredit = {
  bankName: "",
  creditAmount: 0,
  remainAmount: 0,
  creditDate: '1990-12-12',
  isExpired: true,
};

export const defaultQuestionnaireFormState: QuestionnaireFormData = {
  averageEmployeesCountId: AverageEmployeesCountIdEnum.LessThan100,
  taxationSystemId: TaxationSystemIdEnum.Common,
  paymentFormId: 0, // Replace with enum
  belongsToHoldings: false,
  holdingName: '',
  headCompanyName: '',
  headCompanyInn: '',
  hasCredits: false,
  credits: [emptyCredit],
  creditExpirations: [],
  hasTrials: false,
  trials: [],
  suppliers: [],
  buyers: [],
  hasEasyFinansIndividuals: false,
  easyFinanceIndividuals: [],
  hasEasyFinansLegals: false,
  easyFinanceLegals: [],
};
