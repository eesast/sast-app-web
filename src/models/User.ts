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
  createdAt?: Date;
  createdBy?: number;
  updatedAt?: Date;
  updatedBy?: number;
  exp?: number;
}
