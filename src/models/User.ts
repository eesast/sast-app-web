export default interface IUserModel {
  id: number;
  username: string;
  group: string;
  role: string;
  password: string;
  email?: string;
  name: string;
  phone?: number;
  department?: string;
  class?: string;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
  exp?: number;
}
