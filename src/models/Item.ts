export default interface IItemModel {
  id: number;
  name: string;
  description?: string;
  total: number;
  left: number;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}
