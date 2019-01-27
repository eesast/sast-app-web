export default interface ICommentModel {
  id: number;
  authorId: number;
  author?: string;
  articleId: number;
  content: string;
  replyTo: number;
  likers: number[];
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}
