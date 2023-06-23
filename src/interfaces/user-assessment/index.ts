import { UserInterface } from 'interfaces/user';
import { AssessmentInterface } from 'interfaces/assessment';
import { GetQueryInterface } from 'interfaces';

export interface UserAssessmentInterface {
  id?: string;
  user_id?: string;
  assessment_id?: string;
  status: string;
  result?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  assessment?: AssessmentInterface;
  _count?: {};
}

export interface UserAssessmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  assessment_id?: string;
  status?: string;
  result?: string;
}
