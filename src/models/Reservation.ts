export default interface IReservationModel {
  id: number;
  itemId: number;
  itemName?: string;
  userId: number;
  userName?: string;
  from: Date;
  to: Date;
  reason?: string;
  approved: boolean;
  createdAt?: Date;
  createdBy?: number;
  updatedAt?: Date;
  updatedBy?: number;
}
