import {
  AverageEmployeesCountIdEnum,
  TaxationSystemIdEnum,
} from 'components/QuestionnaireForm/QuestionnaireGeneralInfoFormFields';

export interface QuestionnaireFormData {
  averageEmployeesCountId: AverageEmployeesCountIdEnum,
  taxationSystemId: TaxationSystemIdEnum,
  paymentFormId: number,
  belongsToHoldings: boolean,
  holdingName: string,
  headCompanyName: string,
  headCompanyInn: string,
  hasCredits: boolean,
  credits: QuestionnaireFormCredit[],
  creditExpirations: QuestionnaireFormCreditExpiration[],
  hasTrials: boolean,
  trials: QuestionnaireFormTrial[],
  suppliers: QuestionnaireFormSupplierOrBuyer[],
  buyers: QuestionnaireFormSupplierOrBuyer[],
  hasEasyFinansIndividuals: boolean,
  easyFinanceIndividuals: QuestionnaireFormEasyFinanceIndividual[],
  hasEasyFinansLegals: boolean,
  easyFinanceLegals: QuestionnaireFormEasyFinanceLegal[]
}

export interface QuestionnaireFormCreditExpiration {
  expirationId: number,
  isExpired: boolean,
  reason: string
}

export interface QuestionnaireFormCredit {
  bankName: string,
  creditAmount: number,
  remainAmount: number,
  creditDate: `${number}-${number}-${number}`;
  isExpired: boolean
}

export interface QuestionnaireFormTrial {
  complainant: string,
  reason: string,
  amount: number,
  result: string
}

export interface QuestionnaireFormSupplierOrBuyer {
  name: string,
  term: string,
  paymentFormId: number
}

export interface QuestionnaireFormEasyFinanceLegal {
  memberName: string;
}

export interface QuestionnaireFormEasyFinanceIndividual {
  memberName: string,
  relativeName: string,
  relation: string
}

