import axios from 'axios';
import queryString from 'query-string';
import { UserAssessmentInterface, UserAssessmentGetQueryInterface } from 'interfaces/user-assessment';
import { GetQueryInterface } from '../../interfaces';

export const getUserAssessments = async (query?: UserAssessmentGetQueryInterface) => {
  const response = await axios.get(`/api/user-assessments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createUserAssessment = async (userAssessment: UserAssessmentInterface) => {
  const response = await axios.post('/api/user-assessments', userAssessment);
  return response.data;
};

export const updateUserAssessmentById = async (id: string, userAssessment: UserAssessmentInterface) => {
  const response = await axios.put(`/api/user-assessments/${id}`, userAssessment);
  return response.data;
};

export const getUserAssessmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/user-assessments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUserAssessmentById = async (id: string) => {
  const response = await axios.delete(`/api/user-assessments/${id}`);
  return response.data;
};
