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
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}
