import {QuestionnaireFormData} from '../models/questionnaire-form.interface';
import {
  AverageEmployeesCountIdEnum,
  TaxationSystemIdEnum,
} from 'components/QuestionnaireForm/sections/QuestionnaireGeneralInfoFormFields';

export const defaultQuestionnaireFormState: QuestionnaireFormData = {
  averageEmployeesCountId: AverageEmployeesCountIdEnum.LessThan100, // TODO: Replace with enum from dict
  taxationSystemId: TaxationSystemIdEnum.Common, // TODO: Replace with enum from dict
  paymentFormId: 0, // TODO: Replace with enum
  belongsToHoldings: false,
  holdingName: '',
  headCompanyName: '',
  headCompanyInn: '',
  hasCredits: false,
  credits: [{
    bankName: '',
    creditAmount: 0,
    remainAmount: 0,
    creditDate: '',
    isExpired: false,
  }],
  creditExpirations: [
    {expirationId: 0, isExpired: false, reason: ''}, // TODO: Replace with enum
    {expirationId: 1, isExpired: false, reason: ''}, // TODO: Replace with enum
    {expirationId: 2, isExpired: false, reason: ''}, // TODO: Replace with enum
    {expirationId: 3, isExpired: false, reason: ''}, // TODO: Replace with enum
  ],
  hasTrials: false,
  trials: [{
    complainant: '',
    reason: '',
    amount: 0,
    result: '',
  }],
  suppliers: [
    {name: '', term: '', paymentFormId: 0}, // TODO: Replace with enum
  ],
  buyers: [
    {name: '', term: '', paymentFormId: 0}, // TODO: Replace with enum
  ],
  hasEasyFinansIndividuals: false,
  easyFinanceIndividuals: [
    {memberName: '', relativeName: '', relation: ''},
  ],
  hasEasyFinansLegals: false,
  easyFinanceLegals: [{memberName: ''}],
  buyersTotalCount: 0,
  buyersPayDelayCount: 0,
  payDelayMin: 0,
  payDelayAvg: 0,
  payDelayMax: 0,
};
