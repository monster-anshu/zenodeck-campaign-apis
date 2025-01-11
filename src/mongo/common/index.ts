import Company from './schema/Company';
import CompanyProduct from './schema/CompanyProduct';
import CompanyUserPermission from './schema/CompanyUserPermission';
import User from './schema/User';

const ModelList = {
  User,
  Company,
  CompanyProduct,
  CompanyUserPermission,
};

export default ModelList;
export type ModelListType = typeof ModelList;
