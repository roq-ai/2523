import { UserAssessmentInterface } from 'interfaces/user-assessment';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface AssessmentInterface {
  id?: string;
  title: string;
  content: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  user_assessment?: UserAssessmentInterface[];
  organization?: OrganizationInterface;
  _count?: {
    user_assessment?: number;
  };
}

export interface AssessmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  content?: string;
  organization_id?: string;
}
