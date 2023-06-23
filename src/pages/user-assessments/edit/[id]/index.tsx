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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getUserAssessmentById, updateUserAssessmentById } from 'apiSdk/user-assessments';
import { Error } from 'components/error';
import { userAssessmentValidationSchema } from 'validationSchema/user-assessments';
import { UserAssessmentInterface } from 'interfaces/user-assessment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { AssessmentInterface } from 'interfaces/assessment';
import { getUsers } from 'apiSdk/users';
import { getAssessments } from 'apiSdk/assessments';

function UserAssessmentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<UserAssessmentInterface>(
    () => (id ? `/user-assessments/${id}` : null),
    () => getUserAssessmentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: UserAssessmentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateUserAssessmentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/user-assessments');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<UserAssessmentInterface>({
    initialValues: data,
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
            Edit User Assessment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'user_assessment',
  operation: AccessOperationEnum.UPDATE,
})(UserAssessmentEditPage);
