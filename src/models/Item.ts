export default interface IItemModel {
  id: number;
  name: string;
  description?: string;
  total: number;
  left: number;
  createdAt?: Date;
  createdBy?: number;
  updatedAt?: Date;
  updatedBy?: number;
}
