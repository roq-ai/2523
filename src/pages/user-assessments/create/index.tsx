import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createUserAssessment } from 'apiSdk/user-assessments';
import { Error } from 'components/error';
import { userAssessmentValidationSchema } from 'validationSchema/user-assessments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { AssessmentInterface } from 'interfaces/assessment';
import { getUsers } from 'apiSdk/users';
import { getAssessments } from 'apiSdk/assessments';
import { UserAssessmentInterface } from 'interfaces/user-assessment';

function UserAssessmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: UserAssessmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createUserAssessment(values);
      resetForm();
      router.push('/user-assessments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<UserAssessmentInterface>({
    initialValues: {
      status: '',
      result: '',
      user_id: (router.query.user_id as string) ?? null,
      assessment_id: (router.query.assessment_id as string) ?? null,
    },
    validationSchema: userAssessmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create User Assessment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <FormControl id="result" mb="4" isInvalid={!!formik.errors?.result}>
            <FormLabel>Result</FormLabel>
            <Input type="text" name="result" value={formik.values?.result} onChange={formik.handleChange} />
            {formik.errors.result && <FormErrorMessage>{formik.errors?.result}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<AssessmentInterface>
            formik={formik}
            name={'assessment_id'}
            label={'Select Assessment'}
            placeholder={'Select Assessment'}
            fetcher={getAssessments}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'user_assessment',
  operation: AccessOperationEnum.CREATE,
})(UserAssessmentCreatePage);
