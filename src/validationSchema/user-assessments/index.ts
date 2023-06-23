import * as yup from 'yup';

export const userAssessmentValidationSchema = yup.object().shape({
  status: yup.string().required(),
  result: yup.string(),
  user_id: yup.string().nullable(),
  assessment_id: yup.string().nullable(),
});
