export default interface IReservationModel {
  id: number;
  itemId: number;
  itemName?: string;
  userId: number;
  userName?: string;
  from: string;
  to: string;
  reason?: string;
  approved: boolean;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}
