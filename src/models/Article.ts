export default interface IArticleModel {
  id: number;
  title: string;
  alias: string;
  author?: string;
  authorId: number;
  abstract?: string;
  image?: string;
  content: string;
  views: number;
  likers: number[];
  tags: string[];
  visible: boolean;
  createdAt?: Date;
  createdBy?: number;
  updatedAt?: Date;
  updatedBy?: number;
}
