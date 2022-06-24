import {QuestionnaireDto} from 'library/api/questionnaire';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type QuestionnaireFormData = Optional<Required<Omit<QuestionnaireDto, 'id' | 'companyId'>>, 'holdingName' | 'headCompanyName' | 'headCompanyInn'>
