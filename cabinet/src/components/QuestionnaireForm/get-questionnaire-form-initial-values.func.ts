import {QuestionnaireApiResponse} from 'library/api/questionnaire';
import {QuestionnaireFormData} from 'components/QuestionnaireForm/questionnaire-form.interface';
import {defaultQuestionnaireFormState} from 'components/QuestionnaireForm/default-questionnaire-form-state';

export const getQuestionnaireFormInitialValues = (data: QuestionnaireApiResponse | null): QuestionnaireFormData => {
  // console.log(data);
  // if (!data) {
  return defaultQuestionnaireFormState;
  // }


};
