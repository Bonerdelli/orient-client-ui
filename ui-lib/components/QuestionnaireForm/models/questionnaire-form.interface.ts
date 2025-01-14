import { CompanyQuestionnaireDto } from '../../../library/models/proxy'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type QuestionnaireFormData = Optional<Required<Omit<CompanyQuestionnaireDto, 'id' | 'companyId'>>, 'holdingName' | 'headCompanyName' | 'headCompanyInn'>
