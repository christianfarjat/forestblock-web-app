/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IBuildingRelation {
  buildingId: string;
  percentage: number;
}

export interface IAuthorshipUser {
  id: string;
  name: string;
  email: string;
  roles: (string | null)[];
  isLoggedIn: boolean;
  language: string | null;
  company: any;
}

export interface IAuthorship {
  apiInfo?: any;
  lastImpersonatedBy?: IAuthorshipUser | null;
  lastModifiedBy: IAuthorshipUser;
  owner: IAuthorshipUser;
  source?: string;
  createdAt: string;
  updatedAt: string;
  validation: any;
}

export interface Employee {
  authorship: IAuthorship;
  id: string;
  email: string;
  name: string;
  address: string | null;
  ID: string | null;
  phone: string | null;
  language: string;
  companyId: string;
  departmentId: string;
  startDate: string;
  endDate: string | null;
  buildingRelations: IBuildingRelation[];
  percentage: number;
}
